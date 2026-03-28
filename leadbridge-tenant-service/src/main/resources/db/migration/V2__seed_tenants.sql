-- Hyderabad Zone — MSSP
INSERT INTO tenants (id, name, area, mssp_id, realm_name, created_at, tenant_role)
VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'Hyderabad Zone', 'Hyderabad', null, 'zone-hyderabad', NOW(), 'MSSP');

-- Secunderabad Zone — MSSP
INSERT INTO tenants (id, name, area, mssp_id, realm_name, created_at, tenant_role)
VALUES ('aaaaaaaa-0000-0000-0000-000000000002', 'Secunderabad Zone', 'Secunderabad', null, 'zone-secunderabad', NOW(), 'MSSP');

-- Abids — ENTERPRISE_TENANT under Hyderabad Zone
INSERT INTO tenants (id, name, area, mssp_id, realm_name, created_at, tenant_role)
VALUES ('bbbbbbbb-0000-0000-0000-000000000001', 'Abids', 'Abids', 'aaaaaaaa-0000-0000-0000-000000000001', 'tenant-abids', NOW(), 'ENTERPRISE_TENANT');

-- Attapur — ENTERPRISE_TENANT under Hyderabad Zone
INSERT INTO tenants (id, name, area, mssp_id, realm_name, created_at, tenant_role)
VALUES ('bbbbbbbb-0000-0000-0000-000000000002', 'Attapur', 'Attapur', 'aaaaaaaa-0000-0000-0000-000000000001', 'tenant-attapur', NOW(), 'ENTERPRISE_TENANT');

-- Ameerpet — ENTERPRISE_TENANT under Secunderabad Zone
INSERT INTO tenants (id, name, area, mssp_id, realm_name, created_at, tenant_role)
VALUES ('bbbbbbbb-0000-0000-0000-000000000003', 'Ameerpet', 'Ameerpet', 'aaaaaaaa-0000-0000-0000-000000000002', 'tenant-ameerpet', NOW(), 'ENTERPRISE_TENANT');

-- Secunderabad — ENTERPRISE_TENANT under Secunderabad Zone
INSERT INTO tenants (id, name, area, mssp_id, realm_name, created_at, tenant_role)
VALUES ('bbbbbbbb-0000-0000-0000-000000000004', 'Secunderabad', 'Secunderabad', 'aaaaaaaa-0000-0000-0000-000000000002', 'tenant-secunderabad', NOW(), 'ENTERPRISE_TENANT');
