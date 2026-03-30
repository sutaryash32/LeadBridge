# LeadBridge Report Dashboard Fix - TODO

## Status: 🚀 In Progress (4/7 complete)

### 1. [✅] Implement /api/leads/stats endpoint in LeadController.java
   - Already implemented ✓

### 2. [✅] Refactor ReportService.java to use local repositories
   - Lead stats now uses LeadSummaryRepository (bypasses Feign)
   - Ports fixed for report-service (8083)

### 3. [✅] Fix report-service port to 8083 in application.yml
   - server.port: 8083 ✓

### 4. [✅] Add port mapping for report-service in docker-compose.yml
   - ports: - "8083:8083" ✓

### 5. [🔄] Rebuild and restart services
   - Executing: cd infrastructure && docker-compose down && docker-compose up --build
   - Wait for 'Started Application...' logs

### 6. [ ] Verify Eureka registration
   - http://localhost:8761 → all services UP

### 7. [ ] Test dashboards
   - master/master123 → http://localhost:4200/dashboard/master (reports should load)
   - hyd-zone/hyd123 → zone dashboard
   - abids-area/abids123 → area dashboard

**Next**: Wait for services healthy, test master dashboard.

