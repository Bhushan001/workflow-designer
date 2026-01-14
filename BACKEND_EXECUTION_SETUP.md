# Backend Execution Setup

This document describes the backend execution system that has been implemented to move workflow execution from the frontend to the backend.

## Overview

Workflow execution has been moved from the Angular frontend to the Spring Boot backend. The frontend now makes HTTP requests to the backend API to execute workflows and individual nodes.

## Backend Implementation

### API Endpoints

#### 1. Execute Complete Workflow
- **Endpoint:** `POST /api/workflows/execute`
- **Request Body:**
  ```json
  {
    "nodes": [...],
    "edges": [...]
  }
  ```
- **Response:**
  ```json
  {
    "runId": "run-1234567890-abc123",
    "results": [
      {
        "nodeId": "node-1",
        "outputs": {...},
        "status": "success",
        "error": null,
        "timestamp": "2024-01-01T12:00:00Z"
      }
    ]
  }
  ```

#### 2. Execute Single Node
- **Endpoint:** `POST /api/workflows/execute/node`
- **Request Body:**
  ```json
  {
    "node": {...}
  }
  ```
- **Response:**
  ```json
  {
    "nodeId": "node-1",
    "outputs": {...},
    "status": "success",
    "error": null,
    "timestamp": "2024-01-01T12:00:00Z"
  }
  ```

### Backend Components

#### DTOs (Data Transfer Objects)
- `WorkflowNode` - Represents a workflow node
- `WorkflowEdge` - Represents a connection between nodes
- `WorkflowDefinition` - Complete workflow definition
- `ExecutionRequest` - Request for workflow execution
- `ExecutionResult` - Complete execution result
- `NodeRunResult` - Result of a single node execution
- `ExecutionSnapshot` - Snapshot of execution state
- `SingleNodeExecutionRequest` - Request for single node execution

#### Services
- `ExecutionEngineService` - Main orchestration service
  - Validates workflows
  - Performs topological sort
  - Executes nodes in order
  - Handles conditional branching
  - Manages execution context

- `ExecutionContext` - Tracks execution state
  - Stores node outputs
  - Creates execution snapshots
  - Manages run ID and timestamps

#### Node Runners
All node runners implement the `NodeRunner` interface:

1. **TriggerNodeRunner** - Executes trigger nodes
2. **HttpNodeRunner** - Executes HTTP nodes (CIBIL, CRIF, EXPERIAN, EQUIFIX)
   - Uses RestTemplate for HTTP requests
   - Supports GET, POST, PUT, PATCH, DELETE methods
   - Handles timeouts and errors
3. **ConditionNodeRunner** - Executes condition nodes
   - Uses JavaScript engine to evaluate expressions
   - Returns branch decision (true/false)
4. **DoNothingNodeRunner** - Executes do-nothing nodes
5. **CodeNodeRunner** - Executes code nodes
   - Uses JavaScript engine to execute code
   - Provides snapshot access in code

#### Utilities
- `TopologicalSort` - Implements Kahn's algorithm for topological sorting
  - Detects cycles in workflow graph
  - Returns sorted node list

### Configuration

#### RestTemplate Configuration
- Configured in `RestTemplateConfig`
- 10 second connect timeout
- 30 second read timeout

#### CORS Configuration
- Already configured in `CorsConfig`
- Allows requests from `http://localhost:4200`

## Frontend Changes

### Updated Files

1. **`execution-engine.service.ts`**
   - Replaced local execution with HTTP calls to backend
   - Uses `HttpClient` to call backend API
   - Handles errors gracefully

2. **`environment.ts`**
   - Added `apiUrl` configuration
   - Default: `http://localhost:8080/api`

3. **`environment.prod.ts`**
   - Added `apiUrl` configuration
   - Should be updated with production API URL

### Removed Dependencies

The following frontend execution code is no longer used but kept for reference:
- `execution-context.ts` - Execution context (now in backend)
- `topological-sort.ts` - Topological sort (now in backend)
- Node runners in `runners/` directory (now in backend)

## Running the Application

### 1. Start Backend
```bash
cd api
# In IntelliJ IDEA:
# - Open api/ folder as project
# - Set active profile to 'docker' or 'dev'
# - Run ApiApplication.java
# Or use Maven:
./mvnw spring-boot:run
```

Backend will be available at: `http://localhost:8080/api`

### 2. Start Frontend
```bash
cd designer
npm install
npm start
```

Frontend will be available at: `http://localhost:4200`

### 3. Verify Connection
- Open browser console
- Execute a workflow
- Check network tab for API calls to `/api/workflows/execute`

## Testing

### Test Workflow Execution
1. Create a simple workflow with a Trigger node
2. Click "Execute" button
3. Check console for execution results
4. Verify backend logs show execution

### Test Single Node Execution
1. Select a node in the workflow
2. Configure the node
3. Click "Execute Node" button
4. Check results in properties panel

## Error Handling

### Backend Errors
- **400 Bad Request** - Validation errors (missing trigger, invalid config, etc.)
- **500 Internal Server Error** - Execution errors

### Frontend Error Handling
- Errors are caught and displayed to user
- Execution logs show error messages
- Alert dialogs for critical errors

## Node Type Support

All node types are supported:
- ✅ **TRIGGER** - Manual, Schedule, Webhook triggers
- ✅ **CIBIL** - HTTP node for CIBIL API
- ✅ **CRIF** - HTTP node for CRIF API
- ✅ **EXPERIAN** - HTTP node for EXPERIAN API
- ✅ **EQUIFIX** - HTTP node for EQUIFIX API
- ✅ **CONDITION** - Conditional branching
- ✅ **DO_NOTHING** - No-op node
- ✅ **CODE** - JavaScript code execution

## Notes

### JavaScript Engine
- Uses Java's built-in JavaScript engine (Nashorn in Java 8-14, GraalVM in Java 15+)
- For Java 21, GraalVM JavaScript engine is used
- Condition and Code nodes execute JavaScript expressions

### HTTP Node Runner
- Supports all standard HTTP methods
- Handles query parameters
- Supports custom headers
- Configurable timeout
- Returns full request/response information

### Execution Flow
1. Frontend sends workflow definition to backend
2. Backend validates workflow
3. Backend performs topological sort
4. Backend executes nodes in order
5. Backend handles conditional branching
6. Backend returns execution results
7. Frontend displays results

## Troubleshooting

### Backend Not Starting
- Check Java version (requires Java 21)
- Check database connection (PostgreSQL or H2)
- Check port 8080 is available

### Frontend Can't Connect
- Verify backend is running on `http://localhost:8080`
- Check CORS configuration
- Check browser console for errors
- Verify `apiUrl` in environment files

### Execution Fails
- Check backend logs for detailed error messages
- Verify node configurations are valid
- Check network connectivity for HTTP nodes
- Verify JavaScript syntax for Condition/Code nodes

## Future Enhancements

1. **Async Execution** - Support for long-running workflows
2. **Execution History** - Store execution results in database
3. **WebSocket Updates** - Real-time execution progress
4. **Retry Logic** - Automatic retry for failed nodes
5. **Execution Scheduling** - Schedule workflows to run automatically
6. **Execution Monitoring** - Dashboard for execution metrics
