package com.leadbridge.lead.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leadbridge.common.enums.LeadStatus;
import com.leadbridge.lead.entity.Lead;
import com.leadbridge.lead.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Seeds 36 leads from seeds/leads.json on first startup (if table is empty).
 * Tenant IDs are the fixed UUIDs inserted by V2__seed_tenants.sql.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final LeadRepository leadRepository;
    private final ObjectMapper objectMapper;

    // Must match V2__seed_tenants.sql UUIDs exactly
    private static final Map<String, String> AREA_TO_TENANT_ID = Map.of(
        "Abids",         "bbbbbbbb-0000-0000-0000-000000000001",
        "Attapur",       "bbbbbbbb-0000-0000-0000-000000000002",
        "Ameerpet",      "bbbbbbbb-0000-0000-0000-000000000003",
        "Secunderabad",  "bbbbbbbb-0000-0000-0000-000000000004"
    );

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (leadRepository.count() > 0) {
            log.info("Leads already seeded — skipping.");
            return;
        }

        log.info("Seeding leads from seeds/leads.json ...");
        InputStream is = new ClassPathResource("seeds/leads.json").getInputStream();
        List<Map<String, String>> seedData = objectMapper.readValue(is, new TypeReference<>() {});

        for (Map<String, String> row : seedData) {
            String area = row.get("area");
            String tenantId = AREA_TO_TENANT_ID.get(area);
            if (tenantId == null) {
                log.warn("Unknown area '{}' in seed data — skipping row", area);
                continue;
            }

            Lead lead = Lead.builder()
                    .name(row.get("name"))
                    .email(row.get("email"))
                    .phone(row.get("phone"))
                    .status(LeadStatus.valueOf(row.get("status")))
                    .notes(row.get("notes"))
                    .tenantId(tenantId)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            leadRepository.save(lead);
        }

        log.info("Seeded {} leads successfully.", seedData.size());
    }
}
