package com.leadbridge.report.service;

import com.leadbridge.common.enums.LeadStatus;
import com.leadbridge.common.enums.TenantRole;
import com.leadbridge.common.dto.TenantResponseDto;
import com.leadbridge.report.client.LeadServiceClient;
import com.leadbridge.report.client.TenantServiceClient;
import com.leadbridge.report.dto.TenantReportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final LeadServiceClient leadServiceClient;
    private final TenantServiceClient tenantServiceClient;

    public TenantReportDto getTenantReport(String tenantId) {
        log.info("Generating API-based report for tenant: {}", tenantId);

        TenantResponseDto tenant = tenantServiceClient.getTenantById(UUID.fromString(tenantId)).getData();
        String areaName = tenant.getArea();
        Map<LeadStatus, Long> byStatus = getLeadStats(tenantId);

        long totalCount = byStatus.values().stream().mapToLong(Long::longValue).sum();
        long converted = byStatus.getOrDefault(LeadStatus.CONVERTED, 0L);

        double conversionRate = totalCount > 0
                ? Math.round((converted * 100.0 / totalCount) * 10.0) / 10.0
                : 0.0;

        return TenantReportDto.builder()
                .tenantId(tenantId)
                .areaName(areaName)
                .totalLeads(totalCount)
                .byStatus(byStatus)
                .conversionRate(conversionRate)
                .build();
    }

    public List<TenantReportDto> getMsspReport(String msspId) {
        log.info("Generating API-based report for MSSP via Feign: {}", msspId);
        
        // Fetch all tenants that belong to this MSSP
        List<TenantResponseDto> tenants = tenantServiceClient.getMyTenants().getData().stream()
                .filter(t -> TenantRole.ENTERPRISE_TENANT == t.getTenantRole())
                .collect(Collectors.toList());

        return tenants.stream()
                .map(t -> getTenantReport(t.getId().toString()))
                .collect(Collectors.toList());
    }

    public List<TenantReportDto> getGlobalReport() {
        log.info("Generating global API-based report via Feign");

        List<TenantResponseDto> tenants = tenantServiceClient.getAllTenants().getData().stream()
                .filter(t -> TenantRole.ENTERPRISE_TENANT == t.getTenantRole())
                .collect(Collectors.toList());

        return tenants.stream()
                .map(t -> getTenantReport(t.getId().toString()))
                .collect(Collectors.toList());
    }

    private Map<LeadStatus, Long> getLeadStats(String tenantId) {
        return leadServiceClient.getLeadStats(tenantId).getData();
    }
}

