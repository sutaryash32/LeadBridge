package com.leadbridge.lead.repository;

import com.leadbridge.lead.entity.TenantLookup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TenantLookupRepository extends JpaRepository<TenantLookup, UUID> {
}
