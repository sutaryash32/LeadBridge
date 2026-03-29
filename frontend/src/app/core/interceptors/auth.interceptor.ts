import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { from, switchMap } from 'rxjs';

/**
 * DEPRECATED: This interceptor is kept for reference only.
 * The main auth is now handled by HTTP_INTERCEPTORS in app.config.ts
 * which accesses keycloakInstance.token directly.
 * 
 * This version loads the Keycloak instance and forces token refresh
 * before attaching the Authorization header.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const keycloak = inject(KeycloakService);

  // Skip Keycloak's own endpoints and assets
  if (req.url.includes('localhost:8180') || req.url.includes('/assets')) {
    return next(req);
  }

  const keycloakInstance = keycloak.getKeycloakInstance();

  if (!keycloakInstance?.authenticated) {
    return next(req);
  }

  return from(
    keycloakInstance.updateToken(30).then(() => {
      return keycloakInstance.token ?? null;
    }).catch(() => {
      keycloak.login();
      return null;
    })
  ).pipe(
    switchMap(token => {
      if (token) {
        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        }));
      }
      return next(req);
    })
  );
};
