import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadService, Lead } from '../../core/services/lead.service';
import { ReportService, TenantReport } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-area-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './area-dashboard.component.html',
  styleUrls: ['./area-dashboard.component.css'],
})
export class AreaDashboardComponent implements OnInit {
  leads: Lead[] = [];
  report: TenantReport | null = null;
  loading = true;
  error = '';
  showAddForm = false;
  newLead: Partial<Lead> = {};
  statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      NEW: 'new',
      CONTACTED: 'contacted',
      QUALIFIED: 'qualified',
      CONVERTED: 'converted',
      LOST: 'lost'
    };
    return map[status] || 'new';
  }

  constructor(
    private leadService: LeadService,
    private reportService: ReportService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    forkJoin({
      leads:  this.leadService.getLeads(),
      report: this.reportService.getMyReport()
    }).subscribe({
      next: ({ leads, report }) => {
        this.leads = leads.data.content;
        this.report = report.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.formatHttpError('Failed to load dashboard data', err);
        this.loading = false;
        console.error('Dashboard data load error:', err);
      }
    });
  }

  addLead(): void {
    this.leadService.createLead(this.newLead).subscribe({
      next: res => {
        this.leads = [...this.leads, res.data];
        this.showAddForm = false;
        this.newLead = {};
      },
      error: (err) => { this.error = this.formatHttpError('Failed to add lead', err); }
    });
  }

  updateStatus(id: string, status: string): void {
    this.leadService.patchStatus(id, status).subscribe({
      next: res => {
        this.leads = this.leads.map(l => l.id === id ? res.data : l);
      },
      error: (err) => {
        this.error = this.formatHttpError('Failed to update lead status', err);
        console.error('Status update error:', err);
      }
    });
  }

  editLead(lead: Lead): void {
    // Basic editing toggle or placeholder
    alert('Edit lead functionality to be implemented for: ' + lead.name);
  }

  deleteLead(id: string): void {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.leadService.deleteLead(id).subscribe({
        next: () => {
          this.leads = this.leads.filter(l => l.id !== id);
        },
        error: (err) => { this.error = this.formatHttpError('Failed to delete lead', err); }
      });
    }
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
