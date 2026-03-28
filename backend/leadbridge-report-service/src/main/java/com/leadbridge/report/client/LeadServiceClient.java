package com.leadbridge.report.client;

import com.leadbridge.common.dto.ApiResponse;
import com.leadbridge.common.enums.LeadStatus;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "leadbridge-lead-service")
public interface LeadServiceClient {

    @GetMapping("/api/leads/stats")
    ApiResponse<Map<LeadStatus, Long>> getLeadStats(
            @RequestParam(value = "tenantId", required = false) String tenantId);
}
