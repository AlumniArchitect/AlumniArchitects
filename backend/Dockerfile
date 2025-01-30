FROM maven:3.8.6-openjdk-19-slim AS build
WORKDIR /backend
COPY backend .
RUN mvn clean package -DskipTests

FROM openjdk:19-slim
WORKDIR /backend
COPY --from=build /backend/target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "backend.jar"]
