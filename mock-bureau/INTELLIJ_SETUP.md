# IntelliJ IDEA Setup Guide - Mock Bureau

## Maven Configuration

IntelliJ is having issues with the Maven wrapper due to paths with spaces. Here's how to fix it:

### Use IntelliJ's Built-in Maven (Recommended)

1. **Open Settings/Preferences**
   - Mac: `IntelliJ IDEA` → `Preferences`
   - Windows/Linux: `File` → `Settings`

2. **Navigate to Build, Execution, Deployment → Build Tools → Maven**

3. **Maven home path**: Select "Bundled (Maven 3)" or point to your installed Maven

4. **Click "Apply" and "OK"**

5. **Reload Maven Project**
   - Right-click on `pom.xml` → `Maven` → `Reload Project`
   - Or click the Maven icon in the toolbar → Reload All Maven Projects

## Run Configuration

A run configuration is already created at `.idea/runConfigurations/MockBureauApplication.xml`.

To use it:

1. **Open Run Configurations**
   - Click the dropdown next to the Run button
   - Select "Edit Configurations..."

2. **Select "MockBureauApplication"** (should already be there)

3. **Verify Settings**:
   - Main class: `com.workflow.mockbureau.MockBureauApplication`
   - VM options: (leave empty)
   - Environment variables: (none needed)

4. **Click "Apply" and "OK"**

5. **Run the application** using the Run button or Shift+F10

## Quick Start

1. **Open IntelliJ**: Open the `mock-bureau` folder
2. **Reload Maven**: Right-click `pom.xml` → `Maven` → `Reload Project`
3. **Run**: Use the "MockBureauApplication" run configuration
4. **Verify**: Check `http://localhost:8081/mock-bureau/api/health`

## API Endpoints

Once running, test the endpoints:

```bash
# Health check
curl http://localhost:8081/mock-bureau/api/health

# CIBIL
curl -X POST http://localhost:8081/mock-bureau/api/cibil \
  -H "Content-Type: application/json" \
  -d '{"pan":"ABCDE1234F","name":"John Doe"}'

# CRIF
curl -X POST http://localhost:8081/mock-bureau/api/crif \
  -H "Content-Type: application/json" \
  -d '{"pan":"ABCDE1234F","name":"John Doe"}'

# EXPERIAN
curl -X POST http://localhost:8081/mock-bureau/api/experian \
  -H "Content-Type: application/json" \
  -d '{"pan":"ABCDE1234F","name":"John Doe"}'

# EQUIFIX
curl -X POST http://localhost:8081/mock-bureau/api/equifix \
  -H "Content-Type: application/json" \
  -d '{"pan":"ABCDE1234F","name":"John Doe"}'
```

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

1. Use IntelliJ's built-in Maven (see above)
2. Or install Maven globally and point IntelliJ to it

