package com.leadbridge.tenant.mapper;

import com.leadbridge.common.dto.TenantResponseDto;
import com.leadbridge.tenant.dto.TenantRequestDto;
import com.leadbridge.tenant.entity.Tenant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TenantMapper {
    Tenant toEntity(TenantRequestDto dto);
    TenantResponseDto toDto(Tenant entity);
}
