# LeadBridge — Multi-Tenant Lead Management Platform

LeadBridge is a cloud-native, microservices-based application designed for hierarchical lead management. It allows Master Admins, Zone Managers, and Area Managers to efficiently track and communicate with potential leads.

## 🚀 System Architecture

LeadBridge follows a modern **Microservices Architecture**:

-   **Frontend**: Angular 19 (Port 4200)
-   **Gateway**: Spring Cloud Gateway (Port 8080) — Entry point for all API calls.
-   **Discovery**: Eureka Discovery Server (Port 8761) — Service registration.
-   **Services**:
    -   `tenant-service` (8081): Manages regional area managers.
    -   `lead-service` (8082): Core lead management and statistics.
    -   `email-service` (8083): Internal and external email communication.
    -   `report-service` (8084): Data aggregator for dashboards.
-   **Infrastructure**: Dockerized PostgreSQL (5439) and Keycloak (8180).

---

## 👥 User Roles & Access

| Role | Dashboard | Description |
| :--- | :--- | :--- |
| **MASTER_MSSP** | **Master Dashboard** | Super Admin. Sees all tenants, global reports, and manages Area Managers. |
| **MSSP** | **Zone Dashboard** | Zone Manager. Sees aggregated reports for their specific group of tenants. |
| **ENTERPRISE_TENANT** | **Area Dashboard** | Area Manager. Manages individual leads. |

### 🔑 Pre-configured Users (Ready to Use)
| Username | Password | Role | Access Level |
| :--- | :--- | :--- | :--- |
| `master` | `master` | `MASTER_MSSP` | Global |
| `zone` | `zone` | `MSSP` | Regional |
| `area` | `area` | `ENTERPRISE_TENANT` | Local (Tenant `aaaaaaaa-...`) |

---

## 🔄 The User Journey

### 1. Authentication
1.  Navigate to `http://localhost:4200`.
2.  Redirected to Keycloak Login.
3.  Log in with your credentials (e.g., `master` / `master`).
4.  The system validates your **JWT token** and extracts your **Role**.

### 2. The Dashboard Experience
-   **If Master**: You land on `/dashboard/master`. You'll see a list of all tenants and their overall lead conversion rates. You can click on the **Tenants** tab to create new Area Managers.
-   **If MSSP**: You land on `/dashboard/zone`. You see statistics filtered by your zone's performance.
-   **If Tenant**: You land on `/dashboard/area`. You see your specific leads count. You can navigate to **Leads Table** to update a lead from `NEW` to `QUALIFIED`.

### 3. Data Integration & leads.json Flow
How the initial seed data (`leads.json`) reaches the frontend when a user like `master` logs in:

**1. Seed Phase (Backend Initialization):**
- When the `lead-service` boots up, it reads `src/main/resources/seeds/leads.json`.
- This file contains pre-defined mockup data (e.g., 36 leads linked to various tenants like 'Samsung', 'Apollo').
- The service parses this JSON and automatically inserts the records into the PostgreSQL database.

**2. Frontend Request:**
- When the `master` user logs into the Angular frontend (`http://localhost:4200`), they receive a JWT token from Keycloak.
- The Angular app navigates to the Master Dashboard and sends an HTTP GET request to `/api/reports/global` or `/api/leads`.
- The frontend's `JwtInterceptor` automatically attaches the Keycloak token (`Bearer <token>`) to the request headers.

**3. Gateway Routing & Auth Validation:**
- The request hits the `leadbridge-gateway` (Port 8080).
- The gateway validates the token's signature against the Keycloak `issuer-uri` (`http://localhost:8180/realms/leadbridge`).
- Once validated, the gateway routes the request to the target microservice (e.g., `report-service` or `lead-service`).

**4. Data Retrieval & Response:**
- The microservice verifies the user's role (e.g., `@PreAuthorize("hasRole('MASTER_MSSP')")`).
- The service executes a database query to fetch the leads that were originally seeded from `leads.json`.
- The data is aggregated (e.g., counting 'NEW' vs 'QUALIFIED' leads for the Master Report) and returned as a JSON response through the gateway back to the frontend.
- The Angular dashboard successfully renders the charts and tables ("Failed to load reports" is resolved once the token issuer matches and the API responds with 200 OK).

---

## 🛠️ Troubleshooting & Common Fixes

> [!TIP]
> If you encounter issues while running the application, check these common scenarios:

### 1. "Failed to load reports" (403 Forbidden)
- **Cause**: The `master` user is missing permissions in a downstream microservice.
- **Fix**: Ensure the `MASTER_MSSP` role is added to the `@PreAuthorize` annotation in `LeadController`, `TenantController`, and `EmailController`.

### 2. "Internal Server Error" (500) in Lead Stats
- **Cause**: Null values in the leads database or brittle aggregation logic.
- **Fix**: The `LeadService` has been hardened with null checks and robust manual loops to prevent these crashes.

### 3. "Database connection refused" (CORS Policy)
- **Cause**: Gateway is blocking the Angular frontend (Port 4200).
- **Fix**: Check `SecurityConfig.java` in the `gateway` project to ensure `http://localhost:4200` is allowed in the `CorsConfiguration`.

### 4. TimeZone Mismatch (PostgreSQL)
- **Error**: `The server time zone value '...' is unrecognized.`
- **Fix**: Ensure `TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));` is present in the `main` method of all Spring Boot applications.

### 5. "401 Unauthorized" or "Failed to load dashboard data" (Tenant ID Parsing)
- **Cause**: The application was failing to load dashboard reports and leads because Keycloak was passing `tenantId` and `msspId` as JSON arrays inside the JWT (e.g., `["tenant-123"]`), but Spring Security was strictly attempting to read them as primitive strings (`getClaimAsString()`), resulting in `null` values and rejecting the request.
- **Fix**: Implemented a custom JWT claim extractor method in `JwtTenantFilter` and `ReportController` to safely unwrap list-based token claims. After this fix, the Master, Zone, and Area dashboards successfully load all data (Reports, Tenants, and global "All Leads").

### 6. UI Missing Data / Framework Constraints
- **Cause**: Stale UI layouts relying tightly on Angular Material structural components restricted how reports and tables were rendered.
- **Fix**: Transitioned the frontend to a custom "Enterprise Light-Mode" CSS Design System. The Master Dashboard was fully refactored to fetch and explicitly display systemic leads natively using the `LeadService`, restoring visibility to all leads effectively.

---

## 🛠️ How to Add a New Test User

1.  Access Keycloak Admin: `http://localhost:8180/admin`.
2.  Switch to the **`leadbridge`** realm (top-left).
3.  Go to **Users** -> **Add User**.
4.  Set a **Username** (e.g., `test_manager`).
5.  Set a **Password** in the **Credentials** tab (turn off "Temporary").
6.  In **Role Mapping**, assign one of the `leadbridge` roles (e.g., `MSSP`).
7.  **(For Tenants Only)**: In the **Attributes** tab, add `tenantId` with a value corresponding to a valid UUID from your database.

---

## 🚦 Quick Start

1.  **Infrastructure**: `cd infrastructure && docker-compose up -d`
2.  **Backends**: Start Discovery Server (8761) first, then all other services.
3.  **Frontend**: `cd frontend && npm install && ng serve`

---

*LeadBridge — Building bridges between leads and success.*
