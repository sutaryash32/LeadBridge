package com.leadbridge.report.repository;

import com.leadbridge.common.enums.LeadStatus;
import com.leadbridge.report.entity.LeadSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeadSummaryRepository extends JpaRepository<LeadSummary, UUID> {

    List<LeadSummary> findAllByTenantId(String tenantId);

    long countByTenantId(String tenantId);

    long countByTenantIdAndStatus(String tenantId, LeadStatus status);

    @Query("SELECT l FROM LeadSummary l WHERE l.tenantId IN :tenantIds")
    List<LeadSummary> findAllByTenantIdIn(List<String> tenantIds);
}
