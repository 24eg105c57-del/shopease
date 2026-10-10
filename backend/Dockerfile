# Stage 1: Build JAR using Maven with Eclipse Temurin Java 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build production package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy executable jar from build stage
COPY --from=build /app/target/shopease-backend-0.0.1-SNAPSHOT.jar app.jar

# Set dynamic port for Render ($PORT)
ENV PORT=8080
EXPOSE 8080

# Execute Spring Boot application
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
