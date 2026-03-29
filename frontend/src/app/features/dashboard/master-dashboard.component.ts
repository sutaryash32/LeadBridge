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
import { LeadService, Lead } from '../../core/services/lead.service';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-master-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatButtonModule,
    MatProgressSpinnerModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule
  ],
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.css']
})
export class MasterDashboardComponent implements OnInit {
  reports: TenantReport[] = [];
  tenants: Tenant[] = [];
  allLeads: Lead[] = [];
  
  loading = true;
  error = '';
  showForm = false;
  newTenant: Partial<Tenant> = {};

  expandedAreas: Record<string, boolean> = {};

  get totalLeads(): number {
    return this.reports.reduce((sum, r) => sum + r.totalLeads, 0);
  }

  get totalZones(): number {
    return this.tenants.filter(t => t.tenantRole === 'MSSP').length;
  }

  get avgConversionRate(): string {
    if (!this.reports.length) return '0';
    const avg = this.reports.reduce((sum, r) => sum + r.conversionRate, 0) / this.reports.length;
    return avg.toFixed(1);
  }

  // Derived properties for tenant grouping
  get groupedTenants() {
    const zones = this.tenants.filter(t => t.tenantRole === 'MSSP');
    return zones.map(zone => {
      // In this setup, areas associated with a zone share the zone's id as their msspId
      const areas = this.tenants.filter(t => t.tenantRole === 'ENTERPRISE_TENANT' && t.msspId === zone.id);
      return { zone, areas };
    });
  }

  get unmappedTenants() {
    const mappedAreaIds = new Set(
      this.groupedTenants.flatMap(g => g.areas).map(a => a.id)
    );
    return this.tenants.filter(t => 
      t.tenantRole !== 'MSSP' && 
      t.tenantRole !== 'MASTER_MSSP' && 
      !mappedAreaIds.has(t.id)
    );
  }

  constructor(
    private reportService: ReportService,
    private tenantService: TenantService,
    private leadService: LeadService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    forkJoin({
      reports: this.reportService.getGlobalReport(),
      tenants: this.tenantService.getAllTenants(),
      leads: this.leadService.getLeads()
    }).subscribe({
      next: ({ reports, tenants, leads }) => {
        this.reports = reports.data;
        this.tenants = tenants.data;
        this.allLeads = leads.data.content || [];
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load master dashboard data';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleArea(areaName: string): void {
    this.expandedAreas[areaName] = !this.expandedAreas[areaName];
  }

  getLeadsForArea(tenantId: string): Lead[] {
    return this.allLeads.filter(lead => lead.tenantId === tenantId);
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
    if (confirm('Are you sure you want to delete this tenant?')) {
      this.tenantService.deleteTenant(id).subscribe({
        next: () => { this.tenants = this.tenants.filter(t => t.id !== id); },
        error: () => { this.error = 'Failed to delete tenant'; }
      });
    }
  }
}

