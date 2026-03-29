package com.leadbridge.lead.mapper;

import com.leadbridge.lead.dto.LeadRequestDto;
import com.leadbridge.lead.dto.LeadResponseDto;
import com.leadbridge.lead.entity.Lead;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-30T02:10:26+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class LeadMapperImpl implements LeadMapper {

    @Override
    public Lead toEntity(LeadRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Lead.LeadBuilder lead = Lead.builder();

        lead.email( dto.getEmail() );
        lead.name( dto.getName() );
        lead.notes( dto.getNotes() );
        lead.phone( dto.getPhone() );
        lead.status( dto.getStatus() );

        return lead.build();
    }

    @Override
    public LeadResponseDto toDto(Lead entity) {
        if ( entity == null ) {
            return null;
        }

        LeadResponseDto leadResponseDto = new LeadResponseDto();

        leadResponseDto.setCreatedAt( entity.getCreatedAt() );
        leadResponseDto.setEmail( entity.getEmail() );
        leadResponseDto.setId( entity.getId() );
        leadResponseDto.setName( entity.getName() );
        leadResponseDto.setNotes( entity.getNotes() );
        leadResponseDto.setPhone( entity.getPhone() );
        leadResponseDto.setStatus( entity.getStatus() );
        leadResponseDto.setTenantId( entity.getTenantId() );
        leadResponseDto.setUpdatedAt( entity.getUpdatedAt() );

        return leadResponseDto;
    }
}
