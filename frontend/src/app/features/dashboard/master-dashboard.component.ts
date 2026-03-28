import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ReportService, TenantReport } from '../../core/services/report.service';
import { TenantService, Tenant } from '../../core/services/tenant.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-master-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatButtonModule,
    MatProgressSpinnerModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule
  ],
  template: `
    <div style="padding: 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h2 style="margin:0;">LeadPro — Master Dashboard</h2>
        <button mat-stroked-button (click)="authService.logout()">Logout</button>
      </div>

      <div *ngIf="loading" style="display:flex; justify-content:center; padding:40px;">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" style="color: red; margin-bottom:16px;">{{ error }}</div>

      <ng-container *ngIf="!loading && !error">

        <div style="display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap;">
          <mat-card style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ totalLeads }}</div>
              <div style="color:#666;">Total leads</div>
            </mat-card-content>
          </mat-card>
          <mat-card style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ reports.length }}</div>
              <div style="color:#666;">Active areas</div>
            </mat-card-content>
          </mat-card>
          <mat-card style="min-width:160px; text-align:center;">
            <mat-card-content>
              <div style="font-size:32px; font-weight:500;">{{ avgConversionRate }}%</div>
              <div style="color:#666;">Avg conversion</div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card style="margin-bottom:24px;">
          <mat-card-header>
            <mat-card-title>Area breakdown</mat-card-title>
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
              <ng-container matColumnDef="converted">
                <th mat-header-cell *matHeaderCellDef>Converted</th>
                <td mat-cell *matCellDef="let r">{{ r.byStatus['CONVERTED'] || 0 }}</td>
              </ng-container>
              <ng-container matColumnDef="conversionRate">
                <th mat-header-cell *matHeaderCellDef>Conversion rate</th>
                <td mat-cell *matCellDef="let r">{{ r.conversionRate }}%</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="reportColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: reportColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Tenant management</mat-card-title>
            <div style="flex:1;"></div>
            <button mat-raised-button color="accent" (click)="showForm = !showForm">
              Register new tenant
            </button>
          </mat-card-header>
          <mat-card-content>

            <div *ngIf="showForm" style="padding:16px 0; display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;">
              <mat-form-field appearance="outline">
                <mat-label>Tenant name</mat-label>
                <input matInput [(ngModel)]="newTenant.name">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Area</mat-label>
                <input matInput [(ngModel)]="newTenant.area">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Role</mat-label>
                <mat-select [(ngModel)]="newTenant.tenantRole">
                  <mat-option value="MSSP">MSSP</mat-option>
                  <mat-option value="ENTERPRISE_TENANT">Enterprise tenant</mat-option>
                </mat-select>
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="createTenant()">Save</button>
              <button mat-button (click)="showForm = false">Cancel</button>
            </div>

            <table mat-table [dataSource]="tenants" style="width:100%;">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let t">{{ t.name }}</td>
              </ng-container>
              <ng-container matColumnDef="area">
                <th mat-header-cell *matHeaderCellDef>Area</th>
                <td mat-cell *matCellDef="let t">{{ t.area }}</td>
              </ng-container>
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let t">{{ t.tenantRole }}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let t">
                  <button mat-icon-button color="warn" (click)="deleteTenant(t.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="tenantColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: tenantColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

      </ng-container>
    </div>
  `
})
export class MasterDashboardComponent implements OnInit {
  reports: TenantReport[] = [];
  tenants: Tenant[] = [];
  loading = true;
  error = '';
  showForm = false;
  newTenant: Partial<Tenant> = {};

  reportColumns = ['areaName', 'totalLeads', 'converted', 'conversionRate'];
  tenantColumns = ['name', 'area', 'role', 'actions'];

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
    private tenantService: TenantService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.reportService.getGlobalReport().subscribe({
      next: res => { this.reports = res.data; this.loading = false; },
      error: err => { this.error = 'Failed to load reports'; this.loading = false; }
    });
    this.tenantService.getAllTenants().subscribe({
      next: res => this.tenants = res.data,
      error: () => {}
    });
  }

  createTenant(): void {
    this.tenantService.createTenant(this.newTenant).subscribe({
      next: res => {
        this.tenants = [...this.tenants, res.data];
        this.showForm = false;
        this.newTenant = {};
      },
      error: () => { this.error = 'Failed to create tenant'; }
    });
  }

  deleteTenant(id: string): void {
    this.tenantService.deleteTenant(id).subscribe({
      next: () => { this.tenants = this.tenants.filter(t => t.id !== id); },
      error: () => { this.error = 'Failed to delete tenant'; }
    });
  }
}
