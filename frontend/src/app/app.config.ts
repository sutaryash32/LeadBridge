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
import { from, Observable, switchMap } from 'rxjs';
import { routes } from './app.routes';
import { initializeKeycloak } from './core/auth/keycloak.init';
import { AuthStateService } from './core/services/auth-state.service';

/**
 * Keycloak Bearer Token Interceptor
 * Attaches the Keycloak JWT token to all outgoing HTTP requests.
 * Properly awaits token refresh before using the token.
 */
@Injectable()
export class KeycloakBearerInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip Keycloak's own endpoints and static assets
    if (req.url.includes('localhost:8180') || req.url.includes('/assets')) {
      return next.handle(req);
    }

    // Try to get the Keycloak instance and token directly
    try {
      const keycloakInstance = this.keycloak.getKeycloakInstance();

      // If Keycloak is not initialized or no token, pass through
      if (!keycloakInstance || !keycloakInstance.token) {
        return next.handle(req);
      }

      // Refresh token if needed and attach to request
      return from(
        keycloakInstance.updateToken(30)
          .then(() => {
            // Get the latest token after refresh
            const token = keycloakInstance.token;
            if (token) {
              req = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              });
            }
            return token;
          })
          .catch((err) => {
            console.warn('Token refresh failed:', err);
            // Attempt to use existing token anyway
            if (keycloakInstance.token) {
              req = req.clone({
                setHeaders: { Authorization: `Bearer ${keycloakInstance.token}` }
              });
            }
            return keycloakInstance.token;
          })
      ).pipe(
        switchMap(() => next.handle(req))
      );
    } catch (error) {
      console.error('Error in Keycloak interceptor:', error);
      return next.handle(req);
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // CRITICAL FIX: withInterceptorsFromDi() enables HTTP_INTERCEPTORS providers
    provideHttpClient(withInterceptorsFromDi()),

    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AuthStateService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    }
  ]
};
