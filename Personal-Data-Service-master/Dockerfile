# syntax=docker/dockerfile:1.6

# Stage 1: build with Maven (Java 17 — pom uses Spring Boot 3.1.4)
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build

COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -DskipTests package

# Stage 2: runtime
# Use jammy (Ubuntu) instead of alpine — alpine variants are amd64-only,
# breaks on Apple Silicon. jammy supports both amd64 and arm64.
FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app

COPY --from=builder /build/target/*.jar /app/app.jar

# notescover volume — overridable via env
ENV APP_FILE_STORAGE_LOCATION=/data/notescover
RUN mkdir -p /data/notescover /data/documents

EXPOSE 9090

ENTRYPOINT ["java","-jar","/app/app.jar"]
