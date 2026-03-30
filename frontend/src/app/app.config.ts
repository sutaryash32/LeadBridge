import { ApplicationConfig, APP_INITIALIZER, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { from, Observable, switchMap, shareReplay } from 'rxjs';
import { routes } from './app.routes';
import { initializeKeycloak } from './core/auth/keycloak.init';
import { AuthStateService } from './core/services/auth-state.service';
import { environment } from '../environments/environment';

/**
 * Single source of truth for Bearer token injection.
 * authInterceptor.ts is DEPRECATED — this is the only active interceptor.
 *
 * Fix applied:
 *  - shareReplay(1) prevents multiple simultaneous updateToken() calls
 *    when dashboard fires global + leads + reports APIs in parallel.
 *  - Only attaches token to our apiUrl — skips Keycloak and assets.
 */
@Injectable()
export class KeycloakBearerInterceptor implements HttpInterceptor {

  // Cache the in-flight token refresh so parallel requests share one promise
  private tokenRefresh$: Observable<string | null> | null = null;

  constructor(private keycloak: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Only attach token to our own backend — skip everything else
    if (!req.url.includes(environment.apiUrl)) {
      console.log('[KeycloakBearerInterceptor] URL skipped since it does not match apiUrl:', req.url);
      return next.handle(req);
    }

    const keycloakInstance = this.keycloak.getKeycloakInstance();

    // Keycloak not ready or user not authenticated — pass through
    if (!keycloakInstance?.authenticated || !keycloakInstance.token) {
      console.warn('[KeycloakBearerInterceptor] Not authenticated or missing token for:', req.url);
      return next.handle(req);
    }

    // Use cached refresh observable if one is already in flight.
    // This fixes the race condition where global + leads + reports all fire
    // at the same time on dashboard load and each tries to refresh the token.
    if (!this.tokenRefresh$) {
      this.tokenRefresh$ = from(
        keycloakInstance
          .updateToken(30) // refresh if token expires in < 30 seconds
          .then(() => keycloakInstance.token ?? null)
          .catch((err) => {
            console.warn('[KeycloakBearerInterceptor] Token refresh failed:', err);
            // Fall back to existing token — better than forcing re-login
            return keycloakInstance.token ?? null;
          })
          .finally(() => {
            // Clear cache after all parallel requests have consumed it
            setTimeout(() => { this.tokenRefresh$ = null; }, 0);
          })
      ).pipe(
        shareReplay(1) // All parallel subscribers get the same resolved token
      );
    }

    return this.tokenRefresh$.pipe(
      switchMap(token => {
        if (!token) {
          console.warn(`[KeycloakBearerInterceptor] No token available for ${req.url} — sending unauthenticated request`);
          return next.handle(req);
        }
        console.log(`[KeycloakBearerInterceptor] Attaching Bearer token to ${req.url}`);
        // Clone request with Authorization header
        return next.handle(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          })
        );
      })
    );
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // withInterceptorsFromDi() is required for class-based HTTP_INTERCEPTORS to work
    provideHttpClient(withInterceptorsFromDi()),

    KeycloakService,
    AuthStateService,

    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AuthStateService]
    },

    // Single active interceptor — authInterceptor.ts is DEPRECATED, do not register it
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    }
  ]
};