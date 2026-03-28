package com.leadbridge.lead.dto;

import com.leadbridge.common.enums.LeadStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class LeadResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private LeadStatus status;
    private String notes;
    private String tenantId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
