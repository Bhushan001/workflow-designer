# Workflow Designer API

Backend API for the Workflow Designer application built with Spring Boot 3.2.0 and Java 21.

## Prerequisites

- Java 21 or higher
- Maven 3.6+ (or use Maven Wrapper)
- PostgreSQL (for production) or H2 (for development)

## Getting Started

### Development Setup

1. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/Bhushan001/workflow-designer.git
   cd workflow-designer/api
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   
   Or use the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Access the API**
   - API Base URL: `http://localhost:8080/api`
   - H2 Console: `http://localhost:8080/api/h2-console`
   - Health Check: `http://localhost:8080/api/actuator/health` (if actuator is added)

### Profiles

The application supports multiple profiles:

- **dev** (default): Uses H2 in-memory database
- **prod**: Uses PostgreSQL database

To run with a specific profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Project Structure

```
api/
├── src/
│   ├── main/
│   │   ├── java/com/workflow/api/
│   │   │   ├── ApiApplication.java
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── service/         # Business Logic
│   │   │   ├── repository/     # Data Access Layer
│   │   │   ├── model/           # Entity Models
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   └── config/          # Configuration Classes
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-prod.properties
│   └── test/
└── pom.xml
```

## API Endpoints

(To be implemented)

## Database

### Development (H2)
- In-memory database
- Auto-creates schema on startup
- Access console at `/h2-console`

### Production (PostgreSQL)
- Requires PostgreSQL server
- Set environment variables:
  - `DB_USERNAME`: Database username
  - `DB_PASSWORD`: Database password

## Technologies

- **Spring Boot 3.2.0**: Application framework
- **Java 21**: Programming language
- **Spring Data JPA**: Data persistence
- **H2 Database**: Development database
- **PostgreSQL**: Production database
- **Lombok**: Reduces boilerplate code
- **Maven**: Build tool

## Development

### Building
```bash
mvn clean package
```

### Running Tests
```bash
mvn test
```

### Code Formatting
Follow Java coding standards and use your IDE's formatter.

## License

(To be added)

