import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportService, TenantReport } from '../../core/services/report.service';
import { LeadService, Lead } from '../../core/services/lead.service';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-zone-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './zone-dashboard.component.html',
  styleUrls: ['./zone-dashboard.component.css'],
})
export class ZoneDashboardComponent implements OnInit {
  reports: TenantReport[] = [];
  loading = true;
  error = '';
  allLeads: Lead[] = [];
  expandedAreas: Record<string, boolean> = {};
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
    public authService: AuthService,
    private leadService: LeadService
  ) {}

  ngOnInit(): void {
    forkJoin({
      reports: this.reportService.getMsspReport(),
      leads: this.leadService.getLeads(0, 1000)
    }).subscribe({
      next: ({ reports, leads }) => {
        this.reports = reports.data;
        this.allLeads = leads.data.content || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = this.formatHttpError('Failed to load zone report data', err);
        this.loading = false;
      }
    });
  }

  toggleArea(areaName: string): void {
    this.expandedAreas[areaName] = !this.expandedAreas[areaName];
  }

  getLeadsForArea(tenantId: string): Lead[] {
    return this.allLeads.filter(lead => lead.tenantId === tenantId);
  }

  private formatHttpError(prefix: string, err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const backendMessage = typeof err.error?.message === 'string' ? err.error.message : '';
      const detail = backendMessage || `${err.status} ${err.statusText}`.trim();
      return detail ? `${prefix}: ${detail}` : prefix;
    }
    return prefix;
  }
}
