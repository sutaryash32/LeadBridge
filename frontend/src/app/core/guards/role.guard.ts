import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { AuthStateService } from '../services/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    private readonly authState: AuthStateService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
      return false;
    }

    const requiredRoles = route.data['roles'];
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Use our robust AuthStateService to determine if they have the role
    const currentRole = this.authState.currentRole();
    const allowed = requiredRoles.includes(currentRole);

    if (!allowed) {
      console.warn(`[RoleGuard] User role '${currentRole}' is not allowed to access ${state.url}. Required: ${requiredRoles}`);
      await this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }
}
