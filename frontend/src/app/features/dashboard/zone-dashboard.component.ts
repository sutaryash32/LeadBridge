import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportService, TenantReport } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-zone-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zone-dashboard.component.html',
  styleUrls: ['./zone-dashboard.component.css'],
})
export class ZoneDashboardComponent implements OnInit {
  reports: TenantReport[] = [];
  loading = true;
  error = '';

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
      next: (reports) => {
        this.reports = reports.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.formatHttpError('Failed to load zone report data', err);
        this.loading = false;
      }
    });
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
