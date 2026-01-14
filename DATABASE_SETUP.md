# Database Setup Guide

This guide explains how to configure and use PostgreSQL with Liquibase for both auth-service and api services.

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL container running (via docker-compose)

## Quick Start

### 1. Start PostgreSQL Container

```bash
docker-compose up -d postgres
```

This will:
- Start PostgreSQL on port 5432
- Create `workflowdb` database (for api service)
- Create `workflow_auth_db` database (for auth-service)
- Use credentials: `workflow_user` / `workflow_password`

### 2. Configure Services

Both services use Spring profiles to switch between H2 (development) and PostgreSQL (production).

#### For API Service

**Option 1: Set profile in application.properties**
```properties
spring.profiles.active=docker
```

**Option 2: Set via environment variable**
```bash
export SPRING_PROFILES_ACTIVE=docker
```

**Option 3: Set in IntelliJ Run Configuration**
- Environment variables → `SPRING_PROFILES_ACTIVE=docker`

#### For Auth Service

**Option 1: Set profile in application.properties**
```properties
spring.profiles.active=docker
```

**Option 2: Set via environment variable**
```bash
export SPRING_PROFILES_ACTIVE=docker
```

**Option 3: Set in IntelliJ Run Configuration**
- Environment variables → `SPRING_PROFILES_ACTIVE=docker`

### 3. Run Services

Both services will automatically:
- Connect to PostgreSQL
- Run Liquibase migrations on startup
- Create all required tables

## Database Configuration

### PostgreSQL Connection Details

| Service | Database | Host | Port | User | Password |
|---------|----------|------|------|------|----------|
| API | `workflowdb` | localhost | 5432 | workflow_user | workflow_password |
| Auth Service | `workflow_auth_db` | localhost | 5432 | workflow_user | workflow_password |

### Connection Strings

**API Service:**
```
jdbc:postgresql://localhost:5432/workflowdb
```

**Auth Service:**
```
jdbc:postgresql://localhost:5432/workflow_auth_db
```

## Liquibase Configuration

### API Service

- **Changelog**: `api/src/main/resources/db/changelog/db.changelog-master.xml`
- **Changes**: `api/src/main/resources/db/changelog/changes/`
- **Auto-run**: Yes (on application startup)

### Auth Service

- **Changelog**: `auth-service/src/main/resources/db/changelog/db.changelog-master.xml`
- **Changes**: `auth-service/src/main/resources/db/changelog/changes/`
- **Auto-run**: Yes (on application startup)

## Database Schemas

### Auth Service Schema

- `workflow_clients` - Client organizations
- `workflow_roles` - User roles (PLATFORM_ADMIN, CLIENT_ADMIN, CLIENT_USER)
- `workflow_users` - User accounts
- `user_roles` - Many-to-many relationship between users and roles

### API Service Schema

- Defined in `api/src/main/resources/db/changelog/changes/001-initial-schema.xml`

## Manual Liquibase Commands

### Update Database

```bash
# API Service
cd api
mvn liquibase:update \
  -Dliquibase.url=jdbc:postgresql://localhost:5432/workflowdb \
  -Dliquibase.username=workflow_user \
  -Dliquibase.password=workflow_password \
  -Dliquibase.driver=org.postgresql.Driver

# Auth Service
cd auth-service
mvn liquibase:update \
  -Dliquibase.url=jdbc:postgresql://localhost:5432/workflow_auth_db \
  -Dliquibase.username=workflow_user \
  -Dliquibase.password=workflow_password \
  -Dliquibase.driver=org.postgresql.Driver
```

### Generate Changelog from Existing Database

```bash
mvn liquibase:generateChangeLog \
  -Dliquibase.url=jdbc:postgresql://localhost:5432/workflow_auth_db \
  -Dliquibase.username=workflow_user \
  -Dliquibase.password=workflow_password \
  -Dliquibase.driver=org.postgresql.Driver \
  -Dliquibase.outputChangeLogFile=src/main/resources/db/changelog/changes/generated-changelog.xml
```

## Development vs Production

### Development (H2)

- **Profile**: Not set or `dev`
- **Database**: In-memory H2
- **Auto-create**: Yes (via Hibernate `ddl-auto=update`)
- **Use case**: Quick development, testing

### Production (PostgreSQL)

- **Profile**: `docker`
- **Database**: PostgreSQL in Docker
- **Auto-create**: No (via Liquibase)
- **Use case**: Production, integration testing

## Troubleshooting

### Connection Refused

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs workflow-postgres

# Restart container
docker-compose restart postgres
```

### Database Does Not Exist

```bash
# Connect to PostgreSQL
docker exec -it workflow-postgres psql -U workflow_user -d postgres

# Create database manually
CREATE DATABASE workflow_auth_db;
GRANT ALL PRIVILEGES ON DATABASE workflow_auth_db TO workflow_user;
```

### Liquibase Lock Error

```bash
# Connect to database
docker exec -it workflow-postgres psql -U workflow_user -d workflow_auth_db

# Clear lock
DELETE FROM databasechangeloglock;
```

### Reset Database

```bash
# Stop services
docker-compose down

# Remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d postgres
```

## Environment Variables

You can override database settings via environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/workflow_auth_db
export SPRING_DATASOURCE_USERNAME=workflow_user
export SPRING_DATASOURCE_PASSWORD=workflow_password
export SPRING_PROFILES_ACTIVE=docker
```

## Notes

- Liquibase runs automatically on application startup when `spring.profiles.active=docker`
- Hibernate `ddl-auto` is set to `validate` for PostgreSQL to prevent schema conflicts
- Both databases use the same PostgreSQL instance but are logically separated
- The `init-db.sql` script runs automatically when the container starts for the first time
