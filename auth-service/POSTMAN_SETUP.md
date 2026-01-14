# Postman Collection Setup Guide

This guide explains how to import and use the Postman collection for the Workflow Designer Auth Service.

## Files Included

1. **Workflow_Designer_Auth_Service.postman_collection.json** - Main API collection
2. **Workflow_Designer_Auth_Service.postman_environment.json** - Environment variables

## Import Instructions

### Step 1: Import Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select `Workflow_Designer_Auth_Service.postman_collection.json`
4. Click **Import**

### Step 2: Import Environment
1. Click **Import** button again
2. Select `Workflow_Designer_Auth_Service.postman_environment.json`
3. Click **Import**
4. Select the environment from the dropdown (top right): **"Workflow Designer - Auth Service (Local)"**

## Collection Structure

The collection is organized into 4 main folders:

### 1. Bootstrap (Initial Setup)
- **Create PLATFORM Client** - Creates the default PLATFORM client (saves client ID automatically)
- **Create First PLATFORM_ADMIN** - Creates the first platform administrator

### 2. Authentication (Public)
- **Login** - Authenticates user and saves JWT token automatically
- **Signup (CLIENT_USER)** - Public user registration

### 3. Authentication (Protected)
- **Create PLATFORM_ADMIN** - Requires PLATFORM_ADMIN role
- **Create CLIENT_ADMIN** - Requires PLATFORM_ADMIN role
- **Create CLIENT_USER** - Requires CLIENT_ADMIN role

### 4. Clients (Protected)
- **Create Client** - Requires PLATFORM_ADMIN role (saves client ID automatically)
- **Get All Clients** - Requires PLATFORM_ADMIN or CLIENT_ADMIN role

## Quick Start Workflow

### 1. Bootstrap the System

**Step 1: Create PLATFORM Client**
- Run: `1. Bootstrap > Create PLATFORM Client`
- The response will contain a client `id` - this is automatically saved to `platform_client_id` variable

**Step 2: Create First PLATFORM_ADMIN**
- Run: `1. Bootstrap > Create First PLATFORM_ADMIN`
- Use the `platform_client_id` from Step 1 (already in the request body)
- Update username/password as needed

**Step 3: Login**
- Run: `2. Authentication (Public) > Login`
- Use the credentials from Step 2
- JWT token is automatically saved to `auth_token` variable

### 2. Create a Client Organization

**Step 1: Create Client**
- Run: `4. Clients (Protected) > Create Client`
- Update the client name and description
- Client ID is automatically saved to `client_id` variable

**Step 2: Create CLIENT_ADMIN**
- Run: `3. Authentication (Protected) > Create CLIENT_ADMIN`
- Use the `client_id` from Step 1 (already in the request body)
- This user will manage the client organization

**Step 3: Login as CLIENT_ADMIN**
- Run: `2. Authentication (Public) > Login`
- Use CLIENT_ADMIN credentials
- Token is updated automatically

**Step 4: Create CLIENT_USER**
- Run: `3. Authentication (Protected) > Create CLIENT_USER`
- Use the `user_client_id` (automatically set from login response)
- This creates a regular user for the client

## Environment Variables

The collection uses the following environment variables (automatically managed):

| Variable | Description | Auto-Set By |
|----------|-------------|-------------|
| `base_url` | API base URL (default: http://localhost:8081) | Manual |
| `auth_token` | JWT authentication token | Login request |
| `platform_client_id` | PLATFORM client UUID | Create PLATFORM Client |
| `client_id` | Current client UUID | Create Client |
| `user_client_id` | Authenticated user's client UUID | Login request |
| `username` | Username for login | Manual |
| `password` | Password for login | Manual |
| `user_id` | Authenticated user's ID | Login request |
| `user_role` | Authenticated user's role | Login request |

## Testing Different Roles

### As PLATFORM_ADMIN
1. Login with PLATFORM_ADMIN credentials
2. You can:
   - Create clients
   - Create CLIENT_ADMIN users
   - Create other PLATFORM_ADMIN users
   - View all clients

### As CLIENT_ADMIN
1. Login with CLIENT_ADMIN credentials
2. You can:
   - Create CLIENT_USER users for your client
   - View your client (when filtering is implemented)

### As CLIENT_USER
1. Login with CLIENT_USER credentials
2. Limited access (depends on your application requirements)

## Troubleshooting

### Token Expired
- Re-run the Login request to get a new token
- Token expires after 1 hour (3600000 ms) by default

### 401 Unauthorized
- Check if `auth_token` variable is set
- Re-login to refresh the token
- Verify you have the correct role for the endpoint

### 403 Forbidden
- Verify your user has the required role
- Check the endpoint's `@PreAuthorize` annotation requirements

### Client ID Not Found
- Ensure you've created the client first
- Check that `client_id` or `platform_client_id` variables are set
- Verify the UUID format is correct

## Customization

### Change Base URL
1. Select the environment
2. Edit `base_url` variable
3. For production: `https://api.yourdomain.com`

### Add More Environments
1. Duplicate the environment
2. Rename it (e.g., "Production", "Staging")
3. Update `base_url` accordingly

## Notes

- All protected endpoints automatically use the `auth_token` from Bearer authentication
- IDs are automatically extracted and saved from responses
- Date format: `YYYY-MM-DD` (e.g., "1990-01-01")
- Password requirements: Follow your security policies (example uses "Admin@123")
