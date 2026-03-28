package com.leadbridge.tenant.controller;

import com.leadbridge.common.dto.ApiResponse;
import com.leadbridge.tenant.dto.TenantRequestDto;
import com.leadbridge.tenant.dto.TenantResponseDto;
import com.leadbridge.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<ApiResponse<List<TenantResponseDto>>> getMyTenants(@RequestParam String msspId) {
        // Technically msspId should be read from JWT, but this is an example based on specifications
        return ResponseEntity.ok(ApiResponse.success(tenantService.getMyTenants(msspId), "Fetched my tenants"));
    }

    @PostMapping
    @PreAuthorize("hasRole('MASTER_MSSP')")
    public ResponseEntity<ApiResponse<TenantResponseDto>> createTenant(@RequestBody TenantRequestDto requestDto) {
        return ResponseEntity.ok(ApiResponse.success(tenantService.createTenant(requestDto), "Tenant created successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MASTER_MSSP')")
    public ResponseEntity<ApiResponse<Void>> deleteTenant(@PathVariable UUID id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Tenant deleted successfully"));
    }
}
