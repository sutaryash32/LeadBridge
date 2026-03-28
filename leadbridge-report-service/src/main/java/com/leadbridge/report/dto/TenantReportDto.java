package com.leadbridge.report.dto;

import com.leadbridge.common.enums.LeadStatus;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class TenantReportDto {
    private String tenantId;
    private String areaName;
    private long totalLeads;
    private Map<LeadStatus, Long> byStatus;
    private double conversionRate;
}
