# IntelliJ IDEA Setup Guide

## Maven Configuration

IntelliJ is having issues with the Maven wrapper due to paths with spaces. Here's how to fix it:

### Option 1: Use IntelliJ's Built-in Maven (Recommended)

1. **Open Settings/Preferences**
   - Mac: `IntelliJ IDEA` → `Preferences`
   - Windows/Linux: `File` → `Settings`

2. **Navigate to Build, Execution, Deployment → Build Tools → Maven**

3. **Maven home path**: Select "Bundled (Maven 3)" or point to your installed Maven

4. **Maven settings**: Use default or point to your `settings.xml`

5. **Click "Apply" and "OK"**

6. **Reload Maven Project**
   - Right-click on `pom.xml` → `Maven` → `Reload Project`
   - Or click the Maven icon in the toolbar → Reload All Maven Projects

### Option 2: Configure Maven Wrapper (Alternative)

If you prefer to use the Maven wrapper:

1. **Open Settings/Preferences**
   - Navigate to `Build, Execution, Deployment` → `Build Tools` → `Maven` → `Runner`

2. **VM options**: Add:
   ```
   -Dmaven.multiModuleProjectDirectory=$MAVEN_PROJECT_DIR$
   ```

3. **Working directory**: Set to `$MODULE_DIR$`

4. **Use Maven wrapper**: Check this option

## Run Configuration

A run configuration is already created at `.idea/runConfigurations/ApiApplication.xml`.

To use it:

1. **Open Run Configurations**
   - Click the dropdown next to the Run button
   - Select "Edit Configurations..."

2. **Select "ApiApplication"** (should already be there)

3. **Verify Settings**:
   - Main class: `com.workflow.api.ApiApplication`
   - VM options: (leave empty or add `-Dspring.profiles.active=docker`)
   - Environment variables: `SPRING_PROFILES_ACTIVE=docker`

4. **Click "Apply" and "OK"**

5. **Run the application** using the Run button or Shift+F10

## Troubleshooting

### Build Errors

If you see build errors:

1. **Invalidate Caches**
   - `File` → `Invalidate Caches...` → `Invalidate and Restart`

2. **Reimport Maven Project**
   - Right-click `pom.xml` → `Maven` → `Reload Project`

3. **Check Java Version**
   - `File` → `Project Structure` → `Project`
   - Set SDK to Java 21
   - Set Language level to 21

### Maven Wrapper Issues

If Maven wrapper still doesn't work:

1. Use IntelliJ's built-in Maven (Option 1 above)
2. Or install Maven globally and point IntelliJ to it

### Database Connection Issues

1. **Ensure Docker PostgreSQL is running**:
   ```bash
   docker-compose up -d
   ```

2. **Verify profile is set to `docker`**:
   - Check Run Configuration environment variables
   - Or set in `application.properties`: `spring.profiles.active=docker`

3. **Test connection**:
   ```bash
   docker exec -it workflow-postgres psql -U workflow_user -d workflowdb
   ```

## Quick Start

1. **Start PostgreSQL**: `docker-compose up -d` (from project root)
2. **Open IntelliJ**: Open the `api` folder
3. **Reload Maven**: Right-click `pom.xml` → `Maven` → `Reload Project`
4. **Run**: Use the "ApiApplication" run configuration
5. **Verify**: Check `http://localhost:8080/api/health`

