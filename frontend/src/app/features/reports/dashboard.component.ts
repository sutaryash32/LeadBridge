import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { ReportService, TenantReport } from '../../core/services/report.service';
import { LeadService, Lead } from '../../core/services/lead.service';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule,
    MatProgressSpinnerModule, MatChipsModule, MatButtonModule
  ],
  template: `
    <div style="padding: 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h2 style="margin:0;">Reports Dashboard</h2>
        <button mat-stroked-button (click)="authService.logout()">Logout</button>
      </div>

      <div *ngIf="loading" style="display:flex; justify-content:center; padding:40px;">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" style="color:red; margin-bottom:16px;">{{ error }}</div>

      <ng-container *ngIf="!loading && !error">

        <!-- Summary stats -->
        <div style="display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap;">
          <mat-card style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ totalLeads }}</div>
              <div style="color:#666;">Total Leads</div>
            </mat-card-content>
          </mat-card>
          <mat-card style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ totalConverted }}</div>
              <div style="color:#666;">Converted</div>
            </mat-card-content>
          </mat-card>
          <mat-card style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ avgConversionRate }}%</div>
              <div style="color:#666;">Conversion Rate</div>
            </mat-card-content>
          </mat-card>
          <mat-card *ngIf="reports.length > 1" style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ reports.length }}</div>
              <div style="color:#666;">Areas</div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Area breakdown (MSSP / MASTER_MSSP) -->
        <mat-card *ngIf="reports.length > 1" style="margin-bottom:24px;">
          <mat-card-header>
            <mat-card-title>Area Breakdown</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="reports" style="width:100%;">
              <ng-container matColumnDef="areaName">
                <th mat-header-cell *matHeaderCellDef>Area</th>
                <td mat-cell *matCellDef="let r">{{ r.areaName }}</td>
              </ng-container>
              <ng-container matColumnDef="totalLeads">
                <th mat-header-cell *matHeaderCellDef>Total Leads</th>
                <td mat-cell *matCellDef="let r">{{ r.totalLeads }}</td>
              </ng-container>
              <ng-container matColumnDef="new">
                <th mat-header-cell *matHeaderCellDef>New</th>
                <td mat-cell *matCellDef="let r">{{ r.byStatus['NEW'] || 0 }}</td>
              </ng-container>
              <ng-container matColumnDef="converted">
                <th mat-header-cell *matHeaderCellDef>Converted</th>
                <td mat-cell *matCellDef="let r">{{ r.byStatus['CONVERTED'] || 0 }}</td>
              </ng-container>
              <ng-container matColumnDef="conversionRate">
                <th mat-header-cell *matHeaderCellDef>Conversion Rate</th>
                <td mat-cell *matCellDef="let r">{{ r.conversionRate }}%</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="reportColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: reportColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Leads table (ENTERPRISE_TENANT) -->
        <mat-card *ngIf="leads.length > 0 || reports.length === 1">
          <mat-card-header>
            <mat-card-title>Leads</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p *ngIf="leads.length === 0" style="color:#999;">No leads found.</p>
            <table *ngIf="leads.length > 0" mat-table [dataSource]="leads" style="width:100%;">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let l">{{ l.name }}</td>
              </ng-container>
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let l">{{ l.email }}</td>
              </ng-container>
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let l">{{ l.phone }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let l">
                  <span [style.background]="statusColor(l.status)"
                        style="padding:2px 10px; border-radius:12px; font-size:12px;">
                    {{ l.status }}
                  </span>
                </td>
              </ng-container>
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Created</th>
                <td mat-cell *matCellDef="let l">{{ l.createdAt | date:'short' }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="leadColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: leadColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

      </ng-container>
    </div>
  `
})
export class ReportsDashboardComponent implements OnInit {
  reports: TenantReport[] = [];
  leads: Lead[] = [];
  loading = true;
  error = '';
  reportColumns = ['areaName', 'totalLeads', 'new', 'converted', 'conversionRate'];
  leadColumns = ['name', 'email', 'phone', 'status', 'createdAt'];

  get totalLeads(): number {
    return this.reports.reduce((sum, r) => sum + r.totalLeads, 0);
  }

  get totalConverted(): number {
    return this.reports.reduce((sum, r) => sum + (r.byStatus['CONVERTED'] || 0), 0);
  }

  get avgConversionRate(): string {
    if (!this.reports.length) return '0';
    const avg = this.reports.reduce((sum, r) => sum + r.conversionRate, 0) / this.reports.length;
    return avg.toFixed(1);
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      NEW: '#e0e0e0', CONTACTED: '#bbdefb', QUALIFIED: '#fff9c4',
      CONVERTED: '#c8e6c9', LOST: '#ffcdd2'
    };
    return map[status] || '#e0e0e0';
  }

  constructor(
    private reportService: ReportService,
    private leadService: LeadService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole();

    if (role === 'ENTERPRISE_TENANT') {
      forkJoin({
        report: this.reportService.getMyReport().pipe(catchError(() => of(null))),
        leads:  this.leadService.getLeads().pipe(catchError(() => of(null)))
      }).subscribe(({ report, leads }) => {
        if (!report && !leads) {
          this.error = 'Failed to load report data';
        } else {
          if (report) this.reports = [report.data];
          if (leads)  this.leads  = leads.data.content;
        }
        this.loading = false;
      });
    } else {
      const reportCall = role === 'MSSP'
        ? this.reportService.getMsspReport()
        : this.reportService.getGlobalReport();

      reportCall.subscribe({
        next: res => { this.reports = res.data; this.loading = false; },
        error: () => { this.error = 'Failed to load report data'; this.loading = false; }
      });
    }
  }
}
