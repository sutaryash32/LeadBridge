import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export type AppRole = 'MASTER_MSSP' | 'MSSP' | 'ENTERPRISE_TENANT' | 'UNKNOWN';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private keycloak: KeycloakService) {}

  hasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }

  getUserRole(): AppRole {
    if (this.hasRole('MASTER_MSSP')) return 'MASTER_MSSP';
    if (this.hasRole('MSSP')) return 'MSSP';
    if (this.hasRole('ENTERPRISE_TENANT')) return 'ENTERPRISE_TENANT';
    return 'UNKNOWN';
  }

  getDashboardRoute(): string {
    switch (this.getUserRole()) {
      case 'MASTER_MSSP':    return '/master';
      case 'MSSP':           return '/zone';
      case 'ENTERPRISE_TENANT': return '/area';
      default:               return '/unauthorized';
    }
  }

  logout(): void {
    this.keycloak.logout(window.location.origin);
  }
}
