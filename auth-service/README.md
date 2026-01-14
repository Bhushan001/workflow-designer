# Auth Service

Authentication and authorization service for the Workflow Designer application.

## Features

- User registration and login
- JWT-based authentication
- Multi-tenant role-based access control (RBAC)
- Client management
- Password encryption using BCrypt
- Automatic role initialization on startup

## Multi-Tenant Architecture

The system supports a multi-tenant architecture with three roles:

1. **PLATFORM_ADMIN**: Platform-level administrators who can:
   - Create clients
   - Create CLIENT_ADMIN users and assign them to clients
   - Create other PLATFORM_ADMIN users

2. **CLIENT_ADMIN**: Client-level administrators who can:
   - Create CLIENT_USER users for their assigned client
   - Manage users within their client organization

3. **CLIENT_USER**: Regular users who belong to a specific client organization

### Workflow

1. **PLATFORM_ADMIN** creates a new client via `POST /api/clients`
2. **PLATFORM_ADMIN** creates a **CLIENT_ADMIN** user for that client via `POST /api/auth/createClientAdmin`
3. **CLIENT_ADMIN** creates **CLIENT_USER** users for their client via `POST /api/auth/createClientUser`

## Bootstrap Process

To set up the system for the first time:

1. **Create the PLATFORM client** (open endpoint):
   ```bash
   POST /api/clients
   {
     "name": "PLATFORM",
     "description": "Platform default client"
   }
   ```
   Save the `id` from the response - this is the PLATFORM clientId.

2. **Create the first PLATFORM_ADMIN user** (open endpoint):
   ```bash
   POST /api/auth/createPlatformAdmin
   {
     "username": "admin",
     "password": "admin123",
     "firstName": "Platform",
     "lastName": "Admin",
     "clientId": "<PLATFORM_CLIENT_ID_FROM_STEP_1>"
   }
   ```

3. **Login as PLATFORM_ADMIN** to get JWT token:
   ```bash
   POST /api/auth/login
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

After bootstrap, use the JWT token in the `Authorization: Bearer <token>` header for protected endpoints.

## Endpoints

### Authentication (Public - Bootstrap)

- `POST /api/auth/signup` - Register a new CLIENT_USER (public signup)
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/createPlatformAdmin` - Create a PLATFORM_ADMIN user (open for bootstrap)

### Authentication (Protected)

- `POST /api/auth/createClientAdmin` - Create a CLIENT_ADMIN user for a client (requires PLATFORM_ADMIN role)
- `POST /api/auth/createClientUser` - Create a CLIENT_USER for a client (requires CLIENT_ADMIN role)

### Clients (Public - Bootstrap)

- `POST /api/clients` - Create a new client (open for bootstrap to create PLATFORM client)

### Clients (Protected)

- `GET /api/clients` - Get all clients (requires PLATFORM_ADMIN or CLIENT_ADMIN role)

## Configuration

The service uses H2 in-memory database by default. Update `application.properties` to use PostgreSQL or MySQL for production.

### JWT Configuration

- `jwt.secret`: Secret key for JWT signing
- `jwt.expiration`: Token expiration time in milliseconds (default: 3600000 = 1 hour)

## Running

```bash
mvn spring-boot:run
```

The service will start on port 8081.

## Dependencies

- **commons**: Shared constants, DTOs, and exceptions
- Spring Boot Security
- JWT (jjwt)
- ModelMapper
- H2 Database (development)

## Database Schema

The service creates the following tables:
- `workflow_users` - User accounts
- `workflow_roles` - User roles
- `workflow_clients` - Client organizations
- `user_roles` - Many-to-many relationship between users and roles
