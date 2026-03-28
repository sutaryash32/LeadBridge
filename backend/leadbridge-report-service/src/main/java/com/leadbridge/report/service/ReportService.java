package com.leadbridge.report.service;

import com.leadbridge.common.enums.LeadStatus;
import com.leadbridge.common.enums.TenantRole;
import com.leadbridge.report.dto.TenantReportDto;
import com.leadbridge.report.entity.LeadSummary;
import com.leadbridge.report.entity.TenantSummary;
import com.leadbridge.report.repository.LeadSummaryRepository;
import com.leadbridge.report.repository.TenantSummaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final LeadSummaryRepository leadSummaryRepository;
    private final TenantSummaryRepository tenantSummaryRepository;

    public TenantReportDto getTenantReport(String tenantId) {
        log.info("Generating report for tenant: {}", tenantId);

        TenantSummary tenant = tenantSummaryRepository.findById(java.util.UUID.fromString(tenantId))
                .orElseThrow(() -> new RuntimeException("Tenant not found: " + tenantId));

        List<LeadSummary> leads = leadSummaryRepository.findAllByTenantId(tenantId);
        long total = leads.size();

        Map<LeadStatus, Long> byStatus = Arrays.stream(LeadStatus.values())
                .collect(Collectors.toMap(
                        s -> s,
                        s -> leads.stream().filter(l -> l.getStatus() == s).count()
                ));

        long converted = byStatus.getOrDefault(LeadStatus.CONVERTED, 0L);
        double conversionRate = total > 0
                ? Math.round((converted * 100.0 / total) * 10.0) / 10.0
                : 0.0;

        return TenantReportDto.builder()
                .tenantId(tenantId)
                .areaName(tenant.getArea())
                .totalLeads(total)
                .byStatus(byStatus)
                .conversionRate(conversionRate)
                .build();
    }

    public List<TenantReportDto> getMsspReport(String msspId) {
        log.info("Generating report for MSSP: {}", msspId);

        return tenantSummaryRepository
                .findAllByMsspIdAndTenantRole(msspId, TenantRole.ENTERPRISE_TENANT)
                .stream()
                .map(t -> getTenantReport(t.getId().toString()))
                .collect(Collectors.toList());
    }

    public List<TenantReportDto> getGlobalReport() {
        log.info("Generating global report");

        return tenantSummaryRepository
                .findAllByTenantRole(TenantRole.ENTERPRISE_TENANT)
                .stream()
                .map(t -> getTenantReport(t.getId().toString()))
                .collect(Collectors.toList());
    }
}
