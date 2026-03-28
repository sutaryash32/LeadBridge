package com.leadbridge.lead.controller;

import com.leadbridge.common.dto.ApiResponse;
import com.leadbridge.common.enums.LeadStatus;
import com.leadbridge.lead.dto.LeadRequestDto;
import com.leadbridge.lead.dto.LeadResponseDto;
import com.leadbridge.lead.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ENTERPRISE_TENANT') or hasRole('MSSP')")
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public ResponseEntity<ApiResponse<LeadResponseDto>> createLead(@RequestBody LeadRequestDto requestDto) {
        return ResponseEntity.ok(ApiResponse.success(leadService.createLead(requestDto), "Lead created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LeadResponseDto>>> getLeads(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeads(pageable), "Fetched leads successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadResponseDto>> getLeadById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadById(id), "Fetched lead successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadResponseDto>> updateLead(@PathVariable UUID id, @RequestBody LeadRequestDto requestDto) {
        return ResponseEntity.ok(ApiResponse.success(leadService.updateLead(id, requestDto), "Lead updated successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LeadResponseDto>> patchStatus(@PathVariable UUID id, @RequestParam LeadStatus status) {
        return ResponseEntity.ok(ApiResponse.success(leadService.patchStatus(id, status), "Lead status updated successfully"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<java.util.Map<LeadStatus, Long>>> getLeadStats(
            @RequestParam(required = false) String tenantId) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadStats(tenantId), "Fetched lead statistics successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLead(@PathVariable UUID id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Lead deleted successfully"));
    }
}
