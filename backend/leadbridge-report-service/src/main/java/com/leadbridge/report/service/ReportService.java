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

        TenantResponseDto tenant = tenantServiceClient.getTenantById(java.util.UUID.fromString(tenantId)).getData();
        Map<LeadStatus, Long> byStatus = leadServiceClient.getLeadStats(tenantId).getData();

        long totalCount = byStatus.values().stream().mapToLong(Long::longValue).sum();
        long converted = byStatus.getOrDefault(LeadStatus.CONVERTED, 0L);

        double conversionRate = totalCount > 0
                ? Math.round((converted * 100.0 / totalCount) * 10.0) / 10.0
                : 0.0;

        return TenantReportDto.builder()
                .tenantId(tenantId)
                .areaName(tenant.getArea())
                .totalLeads(totalCount)
                .byStatus(byStatus)
                .conversionRate(conversionRate)
                .build();
    }

    public List<TenantReportDto> getMsspReport(String msspId) {
        log.info("Generating API-based report for MSSP via Feign: {}", msspId);

        return tenantServiceClient.getMyTenants().getData()
                .stream()
                .filter(t -> t.getTenantRole() == TenantRole.ENTERPRISE_TENANT)
                .map(t -> getTenantReport(t.getId().toString()))
                .collect(Collectors.toList());
    }

    public List<TenantReportDto> getGlobalReport() {
        log.info("Generating global API-based report via Feign");

        return tenantServiceClient.getAllTenants().getData()
                .stream()
                .filter(t -> t.getTenantRole() == TenantRole.ENTERPRISE_TENANT)
                .map(t -> getTenantReport(t.getId().toString()))
                .collect(Collectors.toList());
    }
}
