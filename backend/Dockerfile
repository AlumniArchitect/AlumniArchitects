FROM maven:3.8.6-eclipse-temurin-19 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:19-jdk-jammy
COPY --from=build /target/*.jar backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "backend.jar"]
