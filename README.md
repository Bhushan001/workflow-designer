# Workflow Designer

A full-stack workflow designer application with Angular frontend and Spring Boot backend.

## Project Structure

```
workflow-designer/
├── designer/          # Angular 19 frontend application
├── api/               # Spring Boot backend API
├── react-app/         # Original React implementation (reference)
└── docker-compose.yml # PostgreSQL database container
```

## Prerequisites

- **Java 21** - For Spring Boot backend
- **Node.js 18+** - For Angular frontend
- **Docker & Docker Compose** - For PostgreSQL database
- **Maven** (or use Maven Wrapper in api/)
- **IntelliJ IDEA** (recommended for backend)
- **Cursor/VS Code** (for Angular development)

## Quick Start

### 1. Start PostgreSQL Database

```bash
# From project root
docker-compose up -d
```

This will start PostgreSQL on port `5432` with:
- Database: `workflowdb`
- Username: `workflow_user`
- Password: `workflow_password`

### 2. Run Backend (IntelliJ IDEA)

1. Open IntelliJ IDEA
2. Open the `api` folder as a project
3. Wait for Maven to download dependencies
4. Set active profile to `docker` in Run Configuration:
   - Edit Configurations → Environment variables → `SPRING_PROFILES_ACTIVE=docker`
   - Or modify `application.properties` to use `spring.profiles.active=docker`
5. Run `ApiApplication.java`
6. Backend will be available at: `http://localhost:8080/api`

### 3. Run Frontend (Cursor Terminal)

```bash
# Navigate to designer folder
cd designer

# Install dependencies (first time only)
npm install

# Start development server
npm start
# or
ng serve
```

Frontend will be available at: `http://localhost:4200`

## Database Configuration

### Docker PostgreSQL (Recommended)

The `docker-compose.yml` sets up PostgreSQL with:
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `workflowdb`
- **Username**: `workflow_user`
- **Password**: `workflow_password`

Backend should use the `docker` profile to connect to this instance.

### H2 In-Memory (Alternative)

If you prefer H2 for development:
- Set `spring.profiles.active=dev` in `application.properties`
- No Docker required
- Data is lost on application restart

## Development Workflow

1. **Start Docker PostgreSQL**: `docker-compose up -d`
2. **Run Backend in IntelliJ**: Use `docker` profile
3. **Run Frontend in Terminal**: `cd designer && npm start`
4. **Access Application**: `http://localhost:4200`

## Useful Commands

### Docker

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f postgres

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Backend (api/)

```bash
# Build project
./mvnw clean install

# Run tests
./mvnw test

# Run application
./mvnw spring-boot:run
```

### Frontend (designer/)

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## API Endpoints

- **Health Check**: `GET http://localhost:8080/api/health`
- More endpoints to be added...

## Environment Variables

### Backend

You can override database settings using environment variables:

```bash
export DB_USERNAME=workflow_user
export DB_PASSWORD=workflow_password
export DB_URL=jdbc:postgresql://localhost:5432/workflowdb
```

## Troubleshooting

### PostgreSQL Connection Issues

1. Verify Docker container is running:
   ```bash
   docker ps
   ```

2. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

3. Test connection:
   ```bash
   docker exec -it workflow-postgres psql -U workflow_user -d workflowdb
   ```

### Port Conflicts

- **PostgreSQL (5432)**: Change port in `docker-compose.yml` if needed
- **Backend (8080)**: Change `server.port` in `application.properties`
- **Frontend (4200)**: Change port in `angular.json` or use `ng serve --port 4201`

## License

(To be added)

