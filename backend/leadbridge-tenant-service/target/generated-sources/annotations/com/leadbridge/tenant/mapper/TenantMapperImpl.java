package com.leadbridge.tenant.mapper;

import com.leadbridge.common.dto.TenantResponseDto;
import com.leadbridge.tenant.dto.TenantRequestDto;
import com.leadbridge.tenant.entity.Tenant;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-29T21:35:02+0530",
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

        TenantResponseDto.TenantResponseDtoBuilder tenantResponseDto = TenantResponseDto.builder();

        tenantResponseDto.id( entity.getId() );
        tenantResponseDto.name( entity.getName() );
        tenantResponseDto.area( entity.getArea() );
        tenantResponseDto.msspId( entity.getMsspId() );
        tenantResponseDto.realmName( entity.getRealmName() );
        tenantResponseDto.createdAt( entity.getCreatedAt() );
        tenantResponseDto.tenantRole( entity.getTenantRole() );

        return tenantResponseDto.build();
    }
}
