import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './lead.service';

export interface Tenant {
  id: string;
  name: string;
  area: string;
  msspId: string;
  realmName: string;
  createdAt: string;
  tenantRole: 'MASTER_MSSP' | 'MSSP' | 'ENTERPRISE_TENANT';
}

@Injectable({ providedIn: 'root' })
export class TenantService {
  private base = `${environment.apiUrl}/tenants`;

  constructor(private http: HttpClient) {}

  getAllTenants(): Observable<ApiResponse<Tenant[]>> {
    return this.http.get<ApiResponse<Tenant[]>>(this.base);
  }

  getMyTenants(): Observable<ApiResponse<Tenant[]>> {
    return this.http.get<ApiResponse<Tenant[]>>(`${this.base}/my`);
  }

  createTenant(tenant: Partial<Tenant>): Observable<ApiResponse<Tenant>> {
    return this.http.post<ApiResponse<Tenant>>(this.base, tenant);
  }

  deleteTenant(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }
}
