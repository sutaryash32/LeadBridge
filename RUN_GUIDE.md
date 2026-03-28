# LeadBridge Application Run Guide

Follow these steps to set up and run the entire LeadBridge microservices architecture and Angular frontend. You can run the application **locally** for development or **via Docker** for a full-stack experience.

## Prerequisites

1.  **Docker Desktop**: Required for all deployment modes.
2.  **Java 17+**: Required for manual backend development.
3.  **Node.js (v18+)**: Required for manual frontend development.
4.  **Maven**: Required to build the backend services (or use `./mvnw`).

---

## Method 1: Dockerized Deployment (Recommended)

This mode runs the **entire** platform (Frontend, Backend, and Infrastructure) using Docker.

### 1. Build the Artifacts
First, compile all microservices and the frontend:

```bash
# Build all backend services
cd backend
./mvnw clean package -DskipTests

# Build the frontend (optional, docker-compose will handle this if you haven't built yet)
# cd ../frontend && npm install && npm run build
```

### 2. Launch the Stack
Navigate to the `infrastructure` directory and start everything:

```bash
cd infrastructure
docker-compose up --build -d
```

### 3. Access the Platform
-   **Frontend**: `http://localhost:4200`
-   **Discovery Server**: `http://localhost:8761`
-   **Keycloak Admin**: `http://localhost:8180/admin` (User: `admin` / Password: `admin`)

---

## Method 2: Manual Local Development

Use this mode if you want to modify code and see changes instantly.

### 1. Start Infrastructure Only
```bash
cd infrastructure
docker-compose up -d postgres keycloak
```

### 2. Start Backend Microservices
Run each service in a separate terminal from its directory:

1.  **Discovery Server**: `cd backend/leadbridge-discovery-server && ./mvnw spring-boot:run`
2.  **Tenant Service**: `cd backend/leadbridge-tenant-service && ./mvnw spring-boot:run`
3.  **Lead Service**: `cd backend/leadbridge-lead-service && ./mvnw spring-boot:run`
4.  **Gateway**: `cd backend/leadbridge-gateway && ./mvnw spring-boot:run`

### 3. Start Frontend
```bash
cd frontend
npm install
ng serve
```

---

## 🛠️ Troubleshooting

-   **Memory**: If containers crash, ensure Docker has at least **8GB of RAM** allocated.
-   **Healthchecks**: If services fail to start, check the logs for the Discovery Server (`docker logs discovery-server`). Other services wait for it to be healthy.
-   **401 Unauthorized**: Refresh the page. Keycloak tokens usually expire in 1-5 minutes in dev mode.
-   **TimeZone**: We've standardized all services to `Asia/Kolkata` for consistency across Docker and Local modes.

---

*LeadBridge — Scalable Lead Management.*
