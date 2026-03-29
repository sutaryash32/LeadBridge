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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadMapper leadMapper;

    // Seed-aligned scope map for MSSP zone managers.
    private static final Map<String, List<String>> MSSP_TO_TENANTS = Map.of(
        "aaaaaaaa-0000-0000-0000-000000000001", Arrays.asList(
            "bbbbbbbb-0000-0000-0000-000000000001",
            "bbbbbbbb-0000-0000-0000-000000000002"
        ),
        "aaaaaaaa-0000-0000-0000-000000000002", Arrays.asList(
            "bbbbbbbb-0000-0000-0000-000000000003",
            "bbbbbbbb-0000-0000-0000-000000000004"
        )
    );

    @Transactional
    public LeadResponseDto createLead(LeadRequestDto requestDto) {
        String role = validateRole();
        if (!"ENTERPRISE_TENANT".equals(role)) {
            throw new ResponseStatusException(FORBIDDEN, "Only area managers can create leads");
        }
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
        String role = validateRole();

        if ("MASTER_MSSP".equals(role)) {
            return leadRepository.findAll(pageable).map(leadMapper::toDto);
        }

        if ("MSSP".equals(role)) {
            List<String> tenantIds = resolveMsspTenantIds();
            if (tenantIds.isEmpty()) {
                return new PageImpl<>(List.of(), pageable, 0);
            }
            return leadRepository.findAllByTenantIdIn(tenantIds, pageable)
                    .map(leadMapper::toDto);
        }

        String tenantId = validateTenantId();
        return leadRepository.findAllByTenantId(tenantId, pageable).map(leadMapper::toDto);
    }

    public LeadResponseDto getLeadById(UUID id) {
        return resolveReadableLead(id)
                .map(leadMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Lead not found"));
    }

    @Transactional
    public LeadResponseDto updateLead(UUID id, LeadRequestDto requestDto) {
        String role = validateRole();
        if ("MSSP".equals(role)) {
            throw new ResponseStatusException(FORBIDDEN, "Zone managers cannot update leads");
        }
        Lead existingLead = resolveWritableLead(id, role);

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
        String role = validateRole();
        if ("MSSP".equals(role)) {
            throw new ResponseStatusException(FORBIDDEN, "Zone managers cannot update lead status");
        }
        Lead existingLead = resolveWritableLead(id, role);

        existingLead.setStatus(newStatus);
        existingLead.setUpdatedAt(LocalDateTime.now());

        existingLead = leadRepository.save(existingLead);
        return leadMapper.toDto(existingLead);
    }

    @Transactional
    public void deleteLead(UUID id) {
        String role = validateRole();
        if (!"MASTER_MSSP".equals(role) && !"ENTERPRISE_TENANT".equals(role)) {
            throw new ResponseStatusException(FORBIDDEN, "Only platform admin or area manager can delete leads");
        }
        Lead lead = resolveWritableLead(id, role);
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

    private Lead resolveWritableLead(UUID id, String role) {
        if ("MASTER_MSSP".equals(role)) {
            return leadRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Lead not found"));
        }

        String tenantId = validateTenantId();
        return leadRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResponseStatusException(FORBIDDEN, "Access denied to this lead"));
    }

    private java.util.Optional<Lead> resolveReadableLead(UUID id) {
        String role = validateRole();
        if ("MASTER_MSSP".equals(role)) {
            return leadRepository.findById(id);
        }
        if ("MSSP".equals(role)) {
            List<String> tenantIds = resolveMsspTenantIds();
            return tenantIds.isEmpty() ? java.util.Optional.empty() : leadRepository.findByIdAndTenantIdIn(id, tenantIds);
        }
        return leadRepository.findByIdAndTenantId(id, validateTenantId());
    }

    private String validateRole() {
        String role = TenantContext.getRole();
        if (role == null || role.isBlank()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Missing role in access token");
        }
        return role;
    }

    private String validateTenantId() {
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null || tenantId.isBlank()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Missing tenantId claim in access token");
        }
        return tenantId;
    }

    private List<String> resolveMsspTenantIds() {
        String msspId = TenantContext.getMsspId();
        if (msspId == null || msspId.isBlank()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Missing msspId claim in access token");
        }
        return MSSP_TO_TENANTS.getOrDefault(msspId, List.of());
    }
}
