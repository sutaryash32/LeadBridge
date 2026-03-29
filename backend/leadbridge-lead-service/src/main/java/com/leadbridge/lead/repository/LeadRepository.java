package com.leadbridge.lead.repository;

import com.leadbridge.common.enums.LeadStatus;
import com.leadbridge.lead.entity.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LeadRepository extends JpaRepository<Lead, UUID> {
    Page<Lead> findAllByTenantId(String tenantId, Pageable pageable);
    Page<Lead> findAllByTenantIdIn(List<String> tenantIds, Pageable pageable);
    Optional<Lead> findByIdAndTenantId(UUID id, String tenantId);
    Optional<Lead> findByIdAndTenantIdIn(UUID id, List<String> tenantIds);
    long countByTenantIdAndStatus(String tenantId, LeadStatus status);
}
