package com.leadbridge.lead.security;

import com.leadbridge.common.context.TenantContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class JwtTenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;
            String role = extractPrimaryRole(jwtToken.getToken().getClaim("realm_access"));
            String tenantId = extractClaimAsString(jwtToken.getToken(), "tenantId");
            String msspId = extractClaimAsString(jwtToken.getToken(), "msspId");

            // Compatibility fallback: older tokens used tenantId for MSSP zone identifier.
            if ((msspId == null || msspId.isBlank()) && "MSSP".equals(role)) {
                msspId = tenantId;
            }

            TenantContext.set(role, tenantId, msspId);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private String extractClaimAsString(org.springframework.security.oauth2.jwt.Jwt jwt, String claimName) {
        Object claim = jwt.getClaim(claimName);
        if (claim == null) return null;
        if (claim instanceof String) return (String) claim;
        if (claim instanceof List<?> list && !list.isEmpty()) return String.valueOf(list.get(0));
        return claim.toString();
    }

    @SuppressWarnings("unchecked")
    private String extractPrimaryRole(Object realmAccessClaim) {
        if (!(realmAccessClaim instanceof Map<?, ?> realmAccessRaw)) {
            return null;
        }

        Map<String, Object> realmAccess = (Map<String, Object>) realmAccessRaw;
        Object rolesObj = realmAccess.getOrDefault("roles", Collections.emptyList());
        if (!(rolesObj instanceof List<?> roles) || roles.isEmpty()) {
            return null;
        }

        return roles.stream()
                .filter(r -> r instanceof String)
                .map(r -> (String) r)
                .filter(r -> r.equals("MASTER_MSSP") || r.equals("MSSP") || r.equals("ENTERPRISE_TENANT"))
                .findFirst()
                .orElse(null);
    }
}
