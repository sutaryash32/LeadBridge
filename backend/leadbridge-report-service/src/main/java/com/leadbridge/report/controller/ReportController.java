package com.leadbridge.report.controller;

import com.leadbridge.common.dto.ApiResponse;
import com.leadbridge.report.dto.TenantReportDto;
import com.leadbridge.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/my")
    @PreAuthorize("hasRole('ENTERPRISE_TENANT')")
    public ResponseEntity<ApiResponse<TenantReportDto>> getMyReport(
            @AuthenticationPrincipal Jwt jwt) {
        String tenantId = extractClaimAsString(jwt, "tenantId");
            if (tenantId == null || tenantId.isBlank()) {
                throw new ResponseStatusException(UNAUTHORIZED, "Missing tenantId claim in access token");
            }
        return ResponseEntity.ok(ApiResponse.success(
                reportService.getTenantReport(tenantId), "Fetched tenant report"));
    }

    @GetMapping("/mssp")
    @PreAuthorize("hasRole('MSSP')")
    public ResponseEntity<ApiResponse<List<TenantReportDto>>> getMsspReport(
            @AuthenticationPrincipal Jwt jwt) {
        String msspId = extractClaimAsString(jwt, "msspId");
        if (msspId == null || msspId.isBlank()) {
            // Compatibility fallback for earlier token shape.
            msspId = extractClaimAsString(jwt, "tenantId");
        }
        if (msspId == null || msspId.isBlank()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Missing msspId claim in access token");
        }
        return ResponseEntity.ok(ApiResponse.success(
                reportService.getMsspReport(msspId), "Fetched MSSP report"));
    }

    @GetMapping("/global")
    @PreAuthorize("hasRole('MASTER_MSSP')")
    public ResponseEntity<ApiResponse<List<TenantReportDto>>> getGlobalReport() {
        return ResponseEntity.ok(ApiResponse.success(
                reportService.getGlobalReport(), "Fetched global report"));
    }

    private String extractClaimAsString(Jwt jwt, String claimName) {
        Object claim = jwt.getClaim(claimName);
        if (claim == null) return null;
        if (claim instanceof String) return (String) claim;
        if (claim instanceof java.util.List<?> list && !list.isEmpty()) return String.valueOf(list.get(0));
        return claim.toString();
    }
}
