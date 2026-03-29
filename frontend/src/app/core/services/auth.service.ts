import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AuthStateService, AppRole } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private keycloak: KeycloakService,
    private authState: AuthStateService
  ) {}

  hasRole(role: string): boolean {
    return this.authState.currentRole() === role;
  }

  getUserRole(): AppRole {
    return this.authState.currentRole();
  }

  getDashboardRoute(): string {
    return this.authState.dashboardRoute();
  }

  logout(): void {
    this.keycloak.logout(window.location.origin);
  }
}
