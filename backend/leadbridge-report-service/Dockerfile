# Stage 1: Build
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy everything from the backend context to satisfy Maven multi-module structure
COPY . .

# Build only the report service and common module
RUN mvn clean package -pl leadbridge-report-service -am -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /app/leadbridge-report-service/target/*.jar app.jar
ENTRYPOINT ["java", "-Duser.timezone=Asia/Kolkata", "-jar", "app.jar"]
