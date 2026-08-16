# CreatorHub

Spring Boot + MySQL backend starter for a creator content-management and analytics system.

## Current implementation
- Maven/Spring Boot project structure
- JPA entities for all required database tables
- MySQL schema with ownership foreign keys and numeric checks
- JWT authentication
- BCrypt password hashing
- Registration, login, logout endpoints
- DTO validation and global error handling

## Run
1. Create the database with `schema.sql`.
2. Set MySQL credentials and a strong JWT secret in `src/main/resources/application.properties`.
3. Run `mvn spring-boot:run`.

## Auth endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`

Protected endpoints should receive `Authorization: Bearer <token>`.
