package com.leadbridge.report.client;

import com.leadbridge.common.dto.ApiResponse;
import com.leadbridge.common.dto.TenantResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "leadbridge-tenant-service")
public interface TenantServiceClient {

    @GetMapping("/api/tenants")
    ApiResponse<List<TenantResponseDto>> getAllTenants();

    @GetMapping("/api/tenants/my")
    ApiResponse<List<TenantResponseDto>> getMyTenants();

    @GetMapping("/api/tenants/{id}")
    ApiResponse<TenantResponseDto> getTenantById(@PathVariable("id") java.util.UUID id);
}
