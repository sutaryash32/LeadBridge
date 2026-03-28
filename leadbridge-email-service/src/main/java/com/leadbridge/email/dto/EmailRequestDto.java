package com.leadbridge.email.dto;

import lombok.Data;
import java.util.Map;

@Data
public class EmailRequestDto {
    private String to;
    private String subject;
    private String templateName;
    private Map<String, Object> variables;
}
