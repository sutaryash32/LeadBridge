package com.leadbridge.report.entity;

import com.leadbridge.common.enums.TenantRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import org.hibernate.annotations.Immutable;

import java.util.UUID;

@Getter
@Immutable
@Entity
@Table(name = "tenants")
public class TenantSummary {

    @Id
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "area")
    private String area;

    @Column(name = "mssp_id")
    private String msspId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tenant_role")
    private TenantRole tenantRole;
}
