import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  notes: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  private base = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) {}

  getLeads(page = 0, size = 20): Observable<ApiResponse<PageResponse<Lead>>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<ApiResponse<PageResponse<Lead>>>(this.base, { params });
  }

  getLeadById(id: string): Observable<ApiResponse<Lead>> {
    return this.http.get<ApiResponse<Lead>>(`${this.base}/${id}`);
  }

  createLead(lead: Partial<Lead>): Observable<ApiResponse<Lead>> {
    return this.http.post<ApiResponse<Lead>>(this.base, lead);
  }

  updateLead(id: string, lead: Partial<Lead>): Observable<ApiResponse<Lead>> {
    return this.http.put<ApiResponse<Lead>>(`${this.base}/${id}`, lead);
  }

  patchStatus(id: string, status: string): Observable<ApiResponse<Lead>> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<ApiResponse<Lead>>(`${this.base}/${id}/status`, null, { params });
  }

  deleteLead(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }
}
