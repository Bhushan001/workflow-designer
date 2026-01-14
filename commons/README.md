# Commons Module

This module contains shared constants, DTOs, enums, exceptions, and models used across all services in the Workflow Designer project.

## Structure

- **constants**: Error and message constants
- **dto**: Data Transfer Objects
- **enums**: Enumerations (UserRole, etc.)
- **exceptions**: Custom exception classes
- **model**: Common response models (ApiResponse, ErrorResponse, etc.)

## Usage

Add this dependency to your service's `pom.xml`:

```xml
<dependency>
    <groupId>com.workflow</groupId>
    <artifactId>commons</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Building

To build this module:

```bash
mvn clean install
```

This will install the commons module to your local Maven repository, making it available to other modules.
