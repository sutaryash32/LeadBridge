package com.leadbridge.lead.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leadbridge.common.enums.LeadStatus;
import com.leadbridge.lead.dto.LeadSeedDto;
import com.leadbridge.lead.entity.Lead;
import com.leadbridge.lead.repository.LeadRepository;
import com.leadbridge.lead.repository.TenantLookupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final LeadRepository leadRepository;
    private final TenantLookupRepository tenantLookupRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        if (leadRepository.count() > 0) {
            log.info("[DataSeeder] Leads already exist — skipping seed.");
            return;
        }

        log.info("[DataSeeder] No leads found — starting seed...");

        // Build area -> tenantId map (lowercase keys for case-insensitive matching)
        Map<String, UUID> areaToTenantId = new HashMap<>();
        tenantLookupRepository.findAll().forEach(t -> {
            if (t.getArea() != null) {
                areaToTenantId.put(t.getArea().toLowerCase(), t.getId());
            }
        });

        if (areaToTenantId.isEmpty()) {
            log.warn("[DataSeeder] No tenants found in DB. Run tenant-service first so V2__seed_tenants.sql is applied.");
            return;
        }

        // Load leads.json
        ClassPathResource resource = new ClassPathResource("seeds/leads.json");
        List<LeadSeedDto> seedDtos;
        try (InputStream is = resource.getInputStream()) {
            seedDtos = objectMapper.readValue(is, new TypeReference<>() {});
        }

        int seeded = 0;
        int skipped = 0;
        LocalDateTime now = LocalDateTime.now();

        for (LeadSeedDto dto : seedDtos) {
            String areaKey = dto.getArea() == null ? null : dto.getArea().toLowerCase();
            UUID tenantId = areaToTenantId.get(areaKey);

            if (tenantId == null) {
                log.warn("[DataSeeder] No tenant found for area='{}' on lead='{}' — skipping.", dto.getArea(), dto.getName());
                skipped++;
                continue;
            }

            Lead lead = Lead.builder()
                    .name(dto.getName())
                    .email(dto.getEmail())
                    .phone(dto.getPhone())
                    .status(dto.getStatus() != null ? dto.getStatus() : LeadStatus.NEW)
                    .notes(dto.getNotes())
                    .tenantId(tenantId.toString())
                    .createdAt(now)
                    .updatedAt(now)
                    .build();

            leadRepository.save(lead);
            seeded++;
        }

        log.info("[DataSeeder] Done. Seeded={} leads across {} tenants. Skipped={} (no area match).",
                seeded, areaToTenantId.size(), skipped);
    }
}
