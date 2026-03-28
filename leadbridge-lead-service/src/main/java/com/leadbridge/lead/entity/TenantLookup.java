package com.leadbridge.lead.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import org.hibernate.annotations.Immutable;

import java.util.UUID;

@Getter
@Immutable
@Entity
@Table(name = "tenants")
public class TenantLookup {

    @Id
    private UUID id;

    @Column(name = "area")
    private String area;
}
