import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

/**
 * DEPRECATED — DO NOT USE.
 *
 * This interceptor is NOT registered in app.config.ts providers.
 * Token injection is handled exclusively by KeycloakBearerInterceptor.
 *
 * Keeping this file to avoid import errors if referenced elsewhere,
 * but it is a no-op — it passes every request through untouched.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // No-op — KeycloakBearerInterceptor in app.config.ts handles this
  return next(req);
};