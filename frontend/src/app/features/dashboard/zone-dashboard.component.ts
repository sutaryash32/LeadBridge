import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportService, TenantReport } from '../../core/services/report.service';
import { TenantService, Tenant } from '../../core/services/tenant.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-zone-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div style="padding: 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h2 style="margin:0;">Zone Dashboard</h2>
        <button mat-stroked-button (click)="authService.logout()">Logout</button>
      </div>

      <div *ngIf="loading" style="display:flex; justify-content:center; padding:40px;">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" style="color:red; margin-bottom:16px;">{{ error }}</div>

      <ng-container *ngIf="!loading && !error">

        <div style="display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap;">
          <mat-card style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ totalLeads }}</div>
              <div style="color:#666;">Leads in zone</div>
            </mat-card-content>
          </mat-card>
          <mat-card style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ reports.length }}</div>
              <div style="color:#666;">Areas</div>
            </mat-card-content>
          </mat-card>
          <mat-card style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ avgConversionRate }}%</div>
              <div style="color:#666;">Zone conversion</div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card>
          <mat-card-header>
            <mat-card-title>My areas</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="reports" style="width:100%;">
              <ng-container matColumnDef="areaName">
                <th mat-header-cell *matHeaderCellDef>Area</th>
                <td mat-cell *matCellDef="let r">{{ r.areaName }}</td>
              </ng-container>
              <ng-container matColumnDef="totalLeads">
                <th mat-header-cell *matHeaderCellDef>Total leads</th>
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
                <th mat-header-cell *matHeaderCellDef>Conversion rate</th>
                <td mat-cell *matCellDef="let r">{{ r.conversionRate }}%</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

      </ng-container>
    </div>
  `
})
export class ZoneDashboardComponent implements OnInit {
  reports: TenantReport[] = [];
  loading = true;
  error = '';
  columns = ['areaName', 'totalLeads', 'new', 'converted', 'conversionRate'];

  get totalLeads(): number {
    return this.reports.reduce((sum, r) => sum + r.totalLeads, 0);
  }

  get avgConversionRate(): string {
    if (!this.reports.length) return '0';
    const avg = this.reports.reduce((sum, r) => sum + r.conversionRate, 0) / this.reports.length;
    return avg.toFixed(1);
  }

  constructor(
    private reportService: ReportService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.reportService.getMsspReport().subscribe({
      next: res => { this.reports = res.data; this.loading = false; },
      error: () => { this.error = 'Failed to load zone report'; this.loading = false; }
    });
  }
}
