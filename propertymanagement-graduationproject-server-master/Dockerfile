# syntax=docker/dockerfile:1.6

# Stage 1: build with Maven
FROM maven:3.8-eclipse-temurin-8 AS builder
WORKDIR /build

COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -DskipTests package

# Stage 2: runtime
# Use jammy (Ubuntu) instead of alpine — alpine variants are amd64-only,
# breaks on Apple Silicon. jammy supports both amd64 and arm64.
FROM eclipse-temurin:8-jre-jammy AS runtime
WORKDIR /app

COPY --from=builder /build/target/*.jar /app/app.jar

EXPOSE 9091

ENTRYPOINT ["java","-jar","/app/app.jar"]
