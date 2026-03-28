package com.leadbridge.lead.service;

import com.leadbridge.common.context.TenantContext;
import com.leadbridge.common.enums.LeadStatus;
import com.leadbridge.lead.dto.LeadRequestDto;
import com.leadbridge.lead.dto.LeadResponseDto;
import com.leadbridge.lead.entity.Lead;
import com.leadbridge.lead.mapper.LeadMapper;
import com.leadbridge.lead.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadMapper leadMapper;

    @Transactional
    public LeadResponseDto createLead(LeadRequestDto requestDto) {
        String tenantId = validateTenantId();
        Lead lead = leadMapper.toEntity(requestDto);
        lead.setTenantId(tenantId);
        lead.setCreatedAt(LocalDateTime.now());
        lead.setUpdatedAt(LocalDateTime.now());
        
        if (lead.getStatus() == null) {
            lead.setStatus(LeadStatus.NEW);
        }

        lead = leadRepository.save(lead);
        return leadMapper.toDto(lead);
    }

    public Page<LeadResponseDto> getLeads(Pageable pageable) {
        String tenantId = validateTenantId();
        return leadRepository.findAllByTenantId(tenantId, pageable)
                .map(leadMapper::toDto);
    }

    public LeadResponseDto getLeadById(UUID id) {
        String tenantId = validateTenantId();
        return leadRepository.findByIdAndTenantId(id, tenantId)
                .map(leadMapper::toDto)
                .orElseThrow(() -> new RuntimeException("ResourceNotFoundException"));
    }

    @Transactional
    public LeadResponseDto updateLead(UUID id, LeadRequestDto requestDto) {
        String tenantId = validateTenantId();
        Lead existingLead = leadRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("ResourceNotFoundException"));

        existingLead.setName(requestDto.getName());
        existingLead.setEmail(requestDto.getEmail());
        existingLead.setPhone(requestDto.getPhone());
        existingLead.setStatus(requestDto.getStatus());
        existingLead.setNotes(requestDto.getNotes());
        existingLead.setUpdatedAt(LocalDateTime.now());

        existingLead = leadRepository.save(existingLead);
        return leadMapper.toDto(existingLead);
    }

    @Transactional
    public LeadResponseDto patchStatus(UUID id, LeadStatus newStatus) {
        String tenantId = validateTenantId();
        Lead existingLead = leadRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("ResourceNotFoundException"));

        existingLead.setStatus(newStatus);
        existingLead.setUpdatedAt(LocalDateTime.now());

        existingLead = leadRepository.save(existingLead);
        return leadMapper.toDto(existingLead);
    }

    @Transactional
    public void deleteLead(UUID id) {
        String tenantId = validateTenantId();
        Lead lead = leadRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        leadRepository.delete(lead);
    }

    public Map<LeadStatus, Long> getLeadStats(String tenantId) {
        try {
            String effectiveTenantId = (tenantId != null && !tenantId.isEmpty()) ? tenantId : validateTenantId();
            log.info("Fetching lead statistics for tenant: {}", effectiveTenantId);
            
            Map<LeadStatus, Long> statsMap = new HashMap<>();
            for (LeadStatus status : LeadStatus.values()) {
                long count = leadRepository.countByTenantIdAndStatus(effectiveTenantId, status);
                statsMap.put(status, count);
            }
            return statsMap;
        } catch (Exception e) {
            log.error("Error generating lead statistics for tenant {}: {}", tenantId, e.getMessage(), e);
            throw new RuntimeException("Failed to generate lead statistics: " + e.getMessage());
        }
    }

    private String validateTenantId() {
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null || tenantId.isBlank()) {
            throw new RuntimeException("Tenant context not found");
        }
        return tenantId;
    }
}
