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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule,
    MatProgressSpinnerModule, MatChipsModule, MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
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
        report: this.reportService.getMyReport(),
        leads:  this.leadService.getLeads()
      }).subscribe({
        next: ({ report, leads }) => {
          this.reports = [report.data];
          this.leads = leads.data.content;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load report data. Please refresh and try again.';
          this.loading = false;
          console.error('Report/leads load error:', err);
        }
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
