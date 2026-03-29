package com.leadbridge.tenant.controller;

import com.leadbridge.common.dto.ApiResponse;
import com.leadbridge.common.dto.TenantResponseDto;
import com.leadbridge.tenant.dto.TenantRequestDto;
import com.leadbridge.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    @GetMapping
    @PreAuthorize("hasRole('MASTER_MSSP')")
    public ResponseEntity<ApiResponse<List<TenantResponseDto>>> getAllTenants() {
        return ResponseEntity.ok(ApiResponse.success(tenantService.getAllTenants(), "Fetched all tenants"));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('MSSP')")
    public ResponseEntity<ApiResponse<List<TenantResponseDto>>> getMyTenants(
            @AuthenticationPrincipal Jwt jwt) {
        String msspId = jwt.getClaimAsString("msspId");
        if (msspId == null || msspId.isBlank()) {
            msspId = jwt.getClaimAsString("tenantId");
        }
        if (msspId == null || msspId.isBlank()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Missing msspId claim in access token");
        }
        return ResponseEntity.ok(ApiResponse.success(tenantService.getMyTenants(msspId), "Fetched my tenants"));
    }

    @PostMapping
    @PreAuthorize("hasRole('MASTER_MSSP')")
    public ResponseEntity<ApiResponse<TenantResponseDto>> createTenant(@RequestBody TenantRequestDto requestDto) {
        return ResponseEntity.ok(ApiResponse.success(tenantService.createTenant(requestDto), "Tenant created successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MSSP') or hasRole('ENTERPRISE_TENANT') or hasRole('MASTER_MSSP')")
    public ResponseEntity<ApiResponse<TenantResponseDto>> getTenantById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(tenantService.getTenantById(id), "Fetched tenant successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MASTER_MSSP')")
    public ResponseEntity<ApiResponse<Void>> deleteTenant(@PathVariable UUID id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Tenant deleted successfully"));
    }
}
