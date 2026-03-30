package com.leadbridge.lead.mapper;

import com.leadbridge.lead.dto.LeadRequestDto;
import com.leadbridge.lead.dto.LeadResponseDto;
import com.leadbridge.lead.entity.Lead;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-30T09:44:08+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class LeadMapperImpl implements LeadMapper {

    @Override
    public Lead toEntity(LeadRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Lead.LeadBuilder lead = Lead.builder();

        lead.name( dto.getName() );
        lead.email( dto.getEmail() );
        lead.phone( dto.getPhone() );
        lead.status( dto.getStatus() );
        lead.notes( dto.getNotes() );

        return lead.build();
    }

    @Override
    public LeadResponseDto toDto(Lead entity) {
        if ( entity == null ) {
            return null;
        }

        LeadResponseDto leadResponseDto = new LeadResponseDto();

        leadResponseDto.setId( entity.getId() );
        leadResponseDto.setName( entity.getName() );
        leadResponseDto.setEmail( entity.getEmail() );
        leadResponseDto.setPhone( entity.getPhone() );
        leadResponseDto.setStatus( entity.getStatus() );
        leadResponseDto.setNotes( entity.getNotes() );
        leadResponseDto.setTenantId( entity.getTenantId() );
        leadResponseDto.setCreatedAt( entity.getCreatedAt() );
        leadResponseDto.setUpdatedAt( entity.getUpdatedAt() );

        return leadResponseDto;
    }
}
