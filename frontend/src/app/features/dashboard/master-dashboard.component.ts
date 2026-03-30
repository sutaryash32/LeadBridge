import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, TenantReport } from '../../core/services/report.service';
import { TenantService, Tenant } from '../../core/services/tenant.service';
import { AuthService } from '../../core/services/auth.service';
import { LeadService, Lead } from '../../core/services/lead.service';

@Component({
  selector: 'app-master-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.css']
})
export class MasterDashboardComponent implements OnInit {
  reports: TenantReport[] = [];
  tenants: Tenant[] = [];
  leads: Lead[] = [];
  
  loading = true;
  error = '';
  showForm = false;
  newTenant: Partial<Tenant> = {};

  expandedAreas: Record<string, boolean> = {};

  getTenantRoleClass(role: string): string {
    const map: Record<string, string> = {
      MSSP: 'mssp',
      ENTERPRISE_TENANT: 'enterprise-tenant',
      MASTER_MSSP: 'master-mssp'
    };
    return map[role] || 'new';
  }

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
    this.reportService.getGlobalReport().subscribe({
      next: res => {
        this.reports = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load master dashboard data';
        this.loading = false;
      }
    });

    this.tenantService.getAllTenants().subscribe({
      next: res => this.tenants = res.data,
      error: () => {}
    });

    this.leadService.getLeads().subscribe({
      next: res => this.leads = res.data.content,
      error: () => {}
    });
  }

  toggleArea(areaName: string): void {
    this.expandedAreas[areaName] = !this.expandedAreas[areaName];
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

  editTenant(tenant: Partial<Tenant>): void {
    // Placeholder for edit functionality
    console.log('Editing tenant:', tenant);
    // Can be extended with a modal/form later
  }
}

