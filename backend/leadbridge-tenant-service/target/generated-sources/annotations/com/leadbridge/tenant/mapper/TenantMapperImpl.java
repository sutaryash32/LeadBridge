package com.leadbridge.tenant.mapper;

import com.leadbridge.tenant.dto.TenantRequestDto;
import com.leadbridge.tenant.dto.TenantResponseDto;
import com.leadbridge.tenant.entity.Tenant;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-28T16:18:56+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class TenantMapperImpl implements TenantMapper {

    @Override
    public Tenant toEntity(TenantRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Tenant.TenantBuilder tenant = Tenant.builder();

        tenant.area( dto.getArea() );
        tenant.msspId( dto.getMsspId() );
        tenant.name( dto.getName() );
        tenant.tenantRole( dto.getTenantRole() );

        return tenant.build();
    }

    @Override
    public TenantResponseDto toDto(Tenant entity) {
        if ( entity == null ) {
            return null;
        }

        TenantResponseDto tenantResponseDto = new TenantResponseDto();

        tenantResponseDto.setArea( entity.getArea() );
        tenantResponseDto.setCreatedAt( entity.getCreatedAt() );
        tenantResponseDto.setId( entity.getId() );
        tenantResponseDto.setMsspId( entity.getMsspId() );
        tenantResponseDto.setName( entity.getName() );
        tenantResponseDto.setRealmName( entity.getRealmName() );
        tenantResponseDto.setTenantRole( entity.getTenantRole() );

        return tenantResponseDto;
    }
}
