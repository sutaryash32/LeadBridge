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
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html'
      }
      // Token injection handled by KeycloakBearerInterceptor in app.config.ts
    }).then(() => authState.initFromKeycloak());
}
