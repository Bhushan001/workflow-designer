# Mock Bureau API

Mock API service for credit bureaus (CIBIL, CRIF, EXPERIAN, EQUIFIX). This service provides POST endpoints that accept request bodies and return sample credit bureau data.

## Prerequisites

- Java 21 or higher
- Maven 3.6+ (or use Maven Wrapper)

## Getting Started

### Build the project

```bash
cd mock-bureau
./mvnw clean install
```

### Run the application

```bash
./mvnw spring-boot:run
```

The service will start on port **8081** with context path `/mock-bureau`.

## API Endpoints

### Health Check
```
GET http://localhost:8081/mock-bureau/api/health
```

### CIBIL
```
POST http://localhost:8081/mock-bureau/api/cibil
Content-Type: application/json

{
  "pan": "ABCDE1234F",
  "name": "John Doe"
}
```

### CRIF
```
POST http://localhost:8081/mock-bureau/api/crif
Content-Type: application/json

{
  "pan": "ABCDE1234F",
  "name": "John Doe"
}
```

### EXPERIAN
```
POST http://localhost:8081/mock-bureau/api/experian
Content-Type: application/json

{
  "pan": "ABCDE1234F",
  "name": "John Doe"
}
```

### EQUIFIX
```
POST http://localhost:8081/mock-bureau/api/equifix
Content-Type: application/json

{
  "pan": "ABCDE1234F",
  "name": "John Doe"
}
```

## Response Format

All endpoints return a standardized response:

```json
{
  "success": true,
  "bureau": "CIBIL",
  "message": "Mock response from CIBIL bureau",
  "data": {
    "bureau": "CIBIL",
    "creditScore": 750,
    "reportNumber": "CIBIL-1234567890",
    "status": "ACTIVE",
    "accounts": { ... },
    "enquiries": 5
  },
  "timestamp": "2025-12-16T11:00:00",
  "requestId": "uuid-here"
}
```

## Features

- **No Database Required**: Pure mock service, no persistence
- **Flexible Request Body**: Accepts any JSON structure
- **Bureau-Specific Data**: Each bureau returns unique mock data
- **CORS Enabled**: Configured for Angular app at `http://localhost:4200`
- **Request ID**: Each response includes a unique request ID

## Configuration

- **Port**: 8081 (configurable in `application.properties`)
- **Context Path**: `/mock-bureau`
- **CORS**: Enabled for `http://localhost:4200`

## Development

### IntelliJ IDEA Setup

1. Open the `mock-bureau` folder in IntelliJ
2. Wait for Maven to download dependencies
3. Run `MockBureauApplication.java`
4. Service will be available at `http://localhost:8081/mock-bureau`

## Testing

### Using cURL

```bash
# Health check
curl http://localhost:8081/mock-bureau/api/health

# CIBIL request
curl -X POST http://localhost:8081/mock-bureau/api/cibil \
  -H "Content-Type: application/json" \
  -d '{"pan":"ABCDE1234F","name":"John Doe"}'
```

## License

(To be added)

