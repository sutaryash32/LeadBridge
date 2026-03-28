package com.leadbridge.report.service;

import com.leadbridge.common.enums.LeadStatus;
import com.leadbridge.report.dto.TenantReportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    // Normally this service uses FeignClient to fetch data from TenantService and LeadService
    // For scaffolding, we will return mocked aggregated data.

    public TenantReportDto getTenantReport(String tenantId) {
        log.info("Generating report for tenant: {}", tenantId);
        
        Map<LeadStatus, Long> byStatus = new HashMap<>();
        byStatus.put(LeadStatus.NEW, 50L);
        byStatus.put(LeadStatus.CONTACTED, 30L);
        byStatus.put(LeadStatus.QUALIFIED, 15L);
        byStatus.put(LeadStatus.CONVERTED, 5L);
        
        return TenantReportDto.builder()
                .tenantId(tenantId)
                .areaName("Mock Area")
                .totalLeads(100L)
                .byStatus(byStatus)
                .conversionRate(5.0)
                .build();
    }

    public List<TenantReportDto> getMsspReport(String msspId) {
        log.info("Generating report for MSSP: {}", msspId);
        List<TenantReportDto> reports = new ArrayList<>();
        reports.add(getTenantReport("tenant-1"));
        reports.add(getTenantReport("tenant-2"));
        return reports;
    }

    public List<TenantReportDto> getGlobalReport() {
        log.info("Generating global report");
        List<TenantReportDto> reports = new ArrayList<>();
        reports.add(getTenantReport("tenant-1"));
        reports.add(getTenantReport("tenant-2"));
        reports.add(getTenantReport("tenant-3"));
        return reports;
    }
}
