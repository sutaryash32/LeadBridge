# LeadBridge Application Run Guide

Follow these steps to set up and run the entire LeadBridge microservices architecture and Angular frontend.

## Prerequisites

1.  **Docker Desktop**: Required for PostgreSQL and Keycloak.
2.  **Java 17+**: Required for the Spring Boot backend.
3.  **Node.js (v18+)**: Required for the Angular frontend.
4.  **Maven**: Required to build the backend services (or use `./mvnw`).

---

## Step 1: Start Infrastructure (Docker)

Navigate to the `infrastructure` directory and start the containers:

```bash
cd infrastructure
docker-compose up -d
```

This will start:
-   **PostgreSQL** on port `5439`.
-   **Keycloak** on port `8180`.

---

## Step 2: Start Backend Microservices

You **must** start the Discovery Server first. For the other services, we recommend the order below.

1.  **Discovery Server (Eureka)**
    -   Path: `backend/leadbridge-discovery-server`
    -   Run: `./mvnw spring-boot:run`
    -   URL: `http://localhost:8761` (Wait for this to be UP)

2.  **Tenant Service**
    -   Path: `backend/leadbridge-tenant-service`
    -   Run: `./mvnw spring-boot:run`
    -   Port: `8081`

3.  **Lead Service**
    -   Path: `backend/leadbridge-lead-service`
    -   Run: `./mvnw spring-boot:run`
    -   Port: `8082`

4.  **Gateway Service**
    -   Path: `backend/leadbridge-gateway`
    -   Run: `./mvnw spring-boot:run`
    -   Port: `8080` (Main API endpoint)

5.  **Email Service** (Optional)
    -   Path: `backend/leadbridge-email-service`
    -   Run: `./mvnw spring-boot:run`
    -   Port: `8083`

6.  **Report Service** (Optional)
    -   Path: `backend/leadbridge-report-service`
    -   Run: `./mvnw spring-boot:run`
    -   Port: `8084`

---

## Step 3: Start Frontend (Angular)

Navigate to the `frontend` directory and install dependencies first.

```bash
cd frontend
npm install
ng serve
```

-   **Frontend URL**: `http://localhost:4200`
-   **Note**: The application is configured to use Keycloak at `http://localhost:8180`.

---

## Troubleshooting

-   **TimeZone Issue**: If PostgreSQL rejects the connection due to `Asia/Calcutta`, ensure you are using the latest code where we've overridden the JVM default to `Asia/Kolkata`.
-   **Missing Tables**: Flyway migrations are isolated. Each service has its own history table (e.g., `flyway_schema_history_lead`).
-   **Keycloak**: If login fails, check if the `leadbridge` realm is imported in Keycloak (`http://localhost:8180/admin`).
