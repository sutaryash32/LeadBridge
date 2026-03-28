package com.leadbridge.report.repository;

import com.leadbridge.common.enums.TenantRole;
import com.leadbridge.report.entity.TenantSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TenantSummaryRepository extends JpaRepository<TenantSummary, UUID> {

    List<TenantSummary> findAllByMsspIdAndTenantRole(String msspId, TenantRole tenantRole);

    List<TenantSummary> findAllByTenantRole(TenantRole tenantRole);
}
