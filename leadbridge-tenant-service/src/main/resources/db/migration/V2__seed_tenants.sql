-- Seed MSSP (Zone Manager) — parent of the 3 enterprise tenants
INSERT INTO tenants (id, name, area, mssp_id, realm_name, created_at, tenant_role)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Zone Alpha MSSP',
  'Zone Alpha',
  NULL,
  'zone-alpha-mssp',
  NOW(),
  'MSSP'
) ON CONFLICT (id) DO NOTHING;

-- Seed 3 ENTERPRISE_TENANT rows, each with a distinct area
INSERT INTO tenants (id, name, area, mssp_id, realm_name, created_at, tenant_role)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Hyderabad Central',
    'Hyderabad',
    'a1000000-0000-0000-0000-000000000001',
    'tenant-hyderabad-central',
    NOW(),
    'ENTERPRISE_TENANT'
  ),
  (
    'b2000000-0000-0000-0000-000000000002',
    'Bangalore South',
    'Bangalore',
    'a1000000-0000-0000-0000-000000000001',
    'tenant-bangalore-south',
    NOW(),
    'ENTERPRISE_TENANT'
  ),
  (
    'b3000000-0000-0000-0000-000000000003',
    'Mumbai West',
    'Mumbai',
    'a1000000-0000-0000-0000-000000000001',
    'tenant-mumbai-west',
    NOW(),
    'ENTERPRISE_TENANT'
  )
ON CONFLICT (id) DO NOTHING;
