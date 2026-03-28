package com.leadbridge.report.entity;

import com.leadbridge.common.enums.LeadStatus;
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
@Table(name = "leads")
public class LeadSummary {

    @Id
    private UUID id;

    @Column(name = "tenant_id")
    private String tenantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private LeadStatus status;
}
