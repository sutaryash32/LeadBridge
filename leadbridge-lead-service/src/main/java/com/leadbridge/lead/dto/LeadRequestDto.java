package com.leadbridge.lead.dto;

import com.leadbridge.common.enums.LeadStatus;
import lombok.Data;

@Data
public class LeadRequestDto {
    private String name;
    private String email;
    private String phone;
    private LeadStatus status;
    private String notes;
}
