package com.leadbridge.tenant.mapper;

import com.leadbridge.common.dto.TenantResponseDto;
import com.leadbridge.tenant.dto.TenantRequestDto;
import com.leadbridge.tenant.entity.Tenant;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-30T02:09:21+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class TenantMapperImpl implements TenantMapper {

    @Override
    public Tenant toEntity(TenantRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        Tenant.TenantBuilder tenant = Tenant.builder();

        tenant.name( dto.getName() );
        tenant.area( dto.getArea() );
        tenant.msspId( dto.getMsspId() );
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
