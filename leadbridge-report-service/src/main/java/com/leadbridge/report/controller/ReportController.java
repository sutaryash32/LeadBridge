package com.leadbridge.report.controller;

import com.leadbridge.common.dto.ApiResponse;
import com.leadbridge.report.dto.TenantReportDto;
import com.leadbridge.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/my")
    @PreAuthorize("hasRole('ENTERPRISE_TENANT')")
    public ResponseEntity<ApiResponse<TenantReportDto>> getMyReport(@RequestParam String tenantId) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getTenantReport(tenantId), "Fetched tenant report"));
    }

    @GetMapping("/mssp")
    @PreAuthorize("hasRole('MSSP')")
    public ResponseEntity<ApiResponse<List<TenantReportDto>>> getMsspReport(@RequestParam String msspId) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getMsspReport(msspId), "Fetched MSSP report"));
    }

    @GetMapping("/global")
    @PreAuthorize("hasRole('MASTER_MSSP')")
    public ResponseEntity<ApiResponse<List<TenantReportDto>>> getGlobalReport() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getGlobalReport(), "Fetched global report"));
    }
}
