package com.leadbridge.tenant.service;

import com.leadbridge.tenant.dto.TenantRequestDto;
import com.leadbridge.tenant.dto.TenantResponseDto;
import com.leadbridge.tenant.entity.Tenant;
import com.leadbridge.tenant.mapper.TenantMapper;
import com.leadbridge.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;
    private final KeycloakAdminService keycloakAdminService;

    @Transactional
    public TenantResponseDto createTenant(TenantRequestDto requestDto) {
        Tenant tenant = tenantMapper.toEntity(requestDto);
        String realmName = "tenant-" + requestDto.getName().toLowerCase().replaceAll("\\s+", "-");
        tenant.setRealmName(realmName);
        tenant.setCreatedAt(LocalDateTime.now());

        tenant = tenantRepository.save(tenant);
        keycloakAdminService.createRealm(realmName);

        return tenantMapper.toDto(tenant);
    }

    public List<TenantResponseDto> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(tenantMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<TenantResponseDto> getMyTenants(String msspId) {
        return tenantRepository.findAllByMsspId(msspId).stream()
                .map(tenantMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteTenant(UUID id) {
        tenantRepository.deleteById(id);
    }
}
