package com.leadbridge.email.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
public class BulkEmailRequestDto {
    private List<UUID> leadIds;
    private String subject;
    private String templateName;
    private Map<String, Object> variables;
}
