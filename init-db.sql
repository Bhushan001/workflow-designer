-- Initialize databases for workflow-designer services
-- This script runs automatically when PostgreSQL container starts for the first time
-- It runs as the postgres superuser

-- Create database for auth-service
CREATE DATABASE workflow_auth_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE workflow_auth_db TO workflow_user;

-- Note: workflowdb (for api service) is created by POSTGRES_DB environment variable
