CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255),
    mssp_id VARCHAR(255),
    realm_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    tenant_role VARCHAR(50) NOT NULL
);
