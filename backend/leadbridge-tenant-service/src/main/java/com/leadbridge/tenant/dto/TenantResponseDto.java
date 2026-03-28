package com.leadbridge.tenant.dto;

import com.leadbridge.common.enums.TenantRole;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TenantResponseDto {
    private UUID id;
    private String name;
    private String area;
    private String msspId;
    private String realmName;
    private LocalDateTime createdAt;
    private TenantRole tenantRole;
}
