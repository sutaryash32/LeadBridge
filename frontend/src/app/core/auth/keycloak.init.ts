import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';
import { AuthStateService } from '../services/auth-state.service';

export function initializeKeycloak(
  keycloak: KeycloakService,
  authState: AuthStateService
) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloakUrl,
        realm: environment.realm,
        clientId: environment.clientId
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256'
        // Removed silentCheckSsoRedirectUri — it was causing a race condition
        // on dashboard load when multiple API calls fire simultaneously
      },
      // Tell keycloak-angular which URLs need the Bearer token.
      // Without this, the library either skips all requests or double-attaches.
      shouldAddToken: (request) => {
        const { method, url } = request;

        // Always add token to our backend API calls
        if (url.includes(environment.apiUrl)) {
          return true;
        }

        // Skip Keycloak's own auth endpoints — no token needed there
        if (url.includes(environment.keycloakUrl)) {
          return false;
        }

        // Skip static assets
        if (url.includes('/assets')) {
          return false;
        }

        return false;
      },
      // Disable the built-in bearer interceptor — we handle it manually
      // in KeycloakBearerInterceptor to control refresh timing
      bearerExcludedUrls: ['localhost:8180', '/assets']
    }).then(() => authState.initFromKeycloak());
}