package com.leadbridge.tenant.repository;

import com.leadbridge.tenant.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    List<Tenant> findAllByMsspId(String msspId);
    Optional<Tenant> findByRealmName(String realmName);
}
