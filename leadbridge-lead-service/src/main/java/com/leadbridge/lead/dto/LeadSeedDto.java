package com.leadbridge.lead.dto;

import com.leadbridge.common.enums.LeadStatus;
import lombok.Data;

@Data
public class LeadSeedDto {
    private String name;
    private String email;
    private String phone;
    private LeadStatus status;
    private String notes;
    private String area;  // used for tenant matching only — not persisted
}
