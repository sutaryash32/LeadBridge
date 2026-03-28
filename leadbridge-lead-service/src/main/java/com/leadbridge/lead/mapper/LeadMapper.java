package com.leadbridge.lead.mapper;

import com.leadbridge.lead.dto.LeadRequestDto;
import com.leadbridge.lead.dto.LeadResponseDto;
import com.leadbridge.lead.entity.Lead;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LeadMapper {
    Lead toEntity(LeadRequestDto dto);
    LeadResponseDto toDto(Lead entity);
}
