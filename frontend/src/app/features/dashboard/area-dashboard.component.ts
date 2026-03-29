import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { LeadService, Lead } from '../../core/services/lead.service';
import { ReportService, TenantReport } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-area-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatSelectModule,
    MatInputModule, FormsModule, MatChipsModule
  ],
  template: `
    <div style="padding: 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h2 style="margin:0;">My Area — Lead Management</h2>
        <button mat-stroked-button (click)="authService.logout()">Logout</button>
      </div>

      <div *ngIf="loading" style="display:flex; justify-content:center; padding:40px;">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" style="color:red; margin-bottom:16px;">{{ error }}</div>

      <ng-container *ngIf="!loading && !error">

        <div style="display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap;">
          <mat-card style="min-width:150px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ report?.totalLeads || 0 }}</div>
              <div style="color:#666;">My leads</div>
            </mat-card-content>
          </mat-card>
          <mat-card style="min-width:150px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ report?.byStatus?.['NEW'] || 0 }}</div>
              <div style="color:#666;">New</div>
            </mat-card-content>
          </mat-card>
          <mat-card style="min-width:150px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ report?.conversionRate || 0 }}%</div>
              <div style="color:#666;">Conversion rate</div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card style="margin-bottom:24px;">
          <mat-card-header>
            <mat-card-title>My leads</mat-card-title>
            <div style="flex:1"></div>
            <button mat-raised-button color="primary" (click)="showAddForm = !showAddForm">
              Add lead
            </button>
          </mat-card-header>
          <mat-card-content>

            <div *ngIf="showAddForm" style="display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end; padding:12px 0;">
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <input matInput [(ngModel)]="newLead.name">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput [(ngModel)]="newLead.email">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput [(ngModel)]="newLead.phone">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Notes</mat-label>
                <input matInput [(ngModel)]="newLead.notes">
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="addLead()">Save</button>
              <button mat-button (click)="showAddForm = false">Cancel</button>
            </div>

            <table mat-table [dataSource]="leads" style="width:100%;">
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
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Status update</th>
                <td mat-cell *matCellDef="let l">
                  <mat-select [value]="l.status" (selectionChange)="updateStatus(l.id, $event.value)"
                              style="font-size:12px; width:130px;">
                    <mat-option *ngFor="let s of statuses" [value]="s">{{ s }}</mat-option>
                  </mat-select>
                </td>
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
export class AreaDashboardComponent implements OnInit {
  leads: Lead[] = [];
  report: TenantReport | null = null;
  loading = true;
  error = '';
  showAddForm = false;
  newLead: Partial<Lead> = {};
  columns = ['name', 'email', 'phone', 'status', 'actions'];
  statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

  statusColor(status: string): string {
    const map: Record<string, string> = {
      NEW: '#e0e0e0', CONTACTED: '#bbdefb', QUALIFIED: '#fff9c4',
      CONVERTED: '#c8e6c9', LOST: '#ffcdd2'
    };
    return map[status] || '#e0e0e0';
  }

  constructor(
    private leadService: LeadService,
    private reportService: ReportService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    forkJoin({
      leads:  this.leadService.getLeads().pipe(catchError(() => of(null))),
      report: this.reportService.getMyReport().pipe(catchError(() => of(null)))
    }).subscribe(({ leads, report }) => {
      if (!leads) {
        this.error = 'Failed to load leads';
      } else {
        this.leads = leads.data.content;
      }
      if (!report) {
        this.error = (this.error ? this.error + '; ' : '') + 'Failed to load report stats';
      } else {
        this.report = report.data;
      }
      this.loading = false;
    });
  }

  addLead(): void {
    this.leadService.createLead(this.newLead).subscribe({
      next: res => {
        this.leads = [...this.leads, res.data];
        this.showAddForm = false;
        this.newLead = {};
      },
      error: () => { this.error = 'Failed to add lead'; }
    });
  }

  updateStatus(id: string, status: string): void {
    this.leadService.patchStatus(id, status).subscribe({
      next: res => {
        this.leads = this.leads.map(l => l.id === id ? res.data : l);
      },
      error: () => {}
    });
  }
}
