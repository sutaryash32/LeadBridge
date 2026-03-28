import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './lead.service';

export interface TenantReport {
  tenantId: string;
  areaName: string;
  totalLeads: number;
  byStatus: { [key: string]: number };
  conversionRate: number;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private base = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getMyReport(): Observable<ApiResponse<TenantReport>> {
    return this.http.get<ApiResponse<TenantReport>>(`${this.base}/my`);
  }

  getMsspReport(): Observable<ApiResponse<TenantReport[]>> {
    return this.http.get<ApiResponse<TenantReport[]>>(`${this.base}/mssp`);
  }

  getGlobalReport(): Observable<ApiResponse<TenantReport[]>> {
    return this.http.get<ApiResponse<TenantReport[]>>(`${this.base}/global`);
  }
}
