package com.leadbridge.common.dto;

import com.leadbridge.common.enums.TenantRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantResponseDto {
    private UUID id;
    private String name;
    private String area;
    private String msspId;
    private String realmName;
    private LocalDateTime createdAt;
    private TenantRole tenantRole;
}
