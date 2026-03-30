import { Injectable, signal } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export type AppRole = 'MASTER_MSSP' | 'MSSP' | 'ENTERPRISE_TENANT' | 'UNKNOWN';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  currentRole = signal<AppRole>('UNKNOWN');
  currentTenantId = signal<string | null>(null);
  currentMsspId = signal<string | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private keycloak: KeycloakService) {}

  async initFromKeycloak(): Promise<void> {
    const authenticated = await this.keycloak.isLoggedIn();
    this.isAuthenticated.set(authenticated);

    if (!authenticated) {
      this.currentRole.set('UNKNOWN');
      this.currentTenantId.set(null);
      this.currentMsspId.set(null);
      return;
    }

    const role = this.resolveRole();
    const parsed = this.keycloak.getKeycloakInstance().tokenParsed as Record<string, unknown> | undefined;

    const tenantId = typeof parsed?.['tenantId'] === 'string' ? parsed['tenantId'] : null;
    const msspIdFromToken = typeof parsed?.['msspId'] === 'string' ? parsed['msspId'] : null;
    const msspId = msspIdFromToken || (role === 'MSSP' ? tenantId : null);

    this.currentRole.set(role);
    this.currentTenantId.set(tenantId);
    this.currentMsspId.set(msspId);
  }

  hasRole(role: AppRole): boolean {
    return this.currentRole() === role;
  }

  dashboardRoute(): string {
    switch (this.currentRole()) {
      case 'MASTER_MSSP':
        return '/dashboard/master';
      case 'MSSP':
        return '/dashboard/zone';
      case 'ENTERPRISE_TENANT':
        return '/dashboard/area';
      default:
        return '/unauthorized';
    }
  }

  private resolveRole(): AppRole {
    // 1. Try Keycloak-Angular's built-in check
    if (this.keycloak.isUserInRole('MASTER_MSSP')) return 'MASTER_MSSP';
    if (this.keycloak.isUserInRole('MSSP')) return 'MSSP';
    if (this.keycloak.isUserInRole('ENTERPRISE_TENANT')) return 'ENTERPRISE_TENANT';

    // 2. Fallback: Check raw token directly just in case realm_access isn't mapped properly by the library
    const tokenParsed = this.keycloak.getKeycloakInstance().tokenParsed as any;
    const realmRoles = tokenParsed?.realm_access?.roles || [];
    
    if (realmRoles.includes('MASTER_MSSP')) return 'MASTER_MSSP';
    if (realmRoles.includes('MSSP')) return 'MSSP';
    if (realmRoles.includes('ENTERPRISE_TENANT')) return 'ENTERPRISE_TENANT';

    console.warn('[AuthStateService] No valid role found in token. Token dump:', tokenParsed);
    return 'UNKNOWN';
  }
}
