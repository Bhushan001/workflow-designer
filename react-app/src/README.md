# N8N-Style Visual Workflow Designer

A fully functional React 18 + TypeScript + Vite application implementing an N8N-style visual workflow designer with mock execution engine.

## Features

### Core Functionality
- **Visual Workflow Designer**: Drag nodes from palette, connect them, and build complex workflows
- **5 Node Types**:
  - **Trigger**: Manual, Schedule, or Webhook triggers
  - **API**: HTTP calls (mocked - no real network requests)
  - **Condition**: JavaScript expression evaluation with true/false branches
  - **Do Nothing**: Placeholder node for workflow organization
  - **Code**: Custom code execution (mocked for security)
  
### Execution Engine
- **Deterministic Execution**: Topological sort ensures correct execution order
- **ExecutionContext**: Provides read-only snapshots of previous node outputs
- **Branch Logic**: Condition nodes control execution flow
- **Validation**: Detects cycles, validates required fields, checks JS syntax

### UI Components
- **Left Palette**: Click-to-add node types
- **React Flow Canvas**: Visual workflow editor with zoom/pan
- **Right Properties Panel**: Dynamic forms for each node type
- **Top Toolbar**: New/Save/Load/Execute/Zoom controls
- **Bottom Console**: Real-time execution logs

### State Management
- **Zustand Store**: Centralized workflow state
- **localStorage Persistence**: Save/load workflows locally

## Architecture

### File Structure
```
src/
  components/
    palette/
      NodePalette.tsx
    canvas/
      WorkflowCanvas.tsx
    nodes/
      TriggerNode.tsx
      ApiNode.tsx
      ConditionNode.tsx
      DoNothingNode.tsx
      CodeNode.tsx
    properties-panel/
      PropertiesPanel.tsx
      TriggerProperties.tsx
      ApiProperties.tsx
      ConditionProperties.tsx
      DoNothingProperties.tsx
      CodeProperties.tsx
    toolbar/
      Toolbar.tsx
    console/
      ExecutionConsole.tsx
  state/
    workflow.store.ts
  engine/
    execution-engine.ts
    context.ts
    runners/
      trigger.ts
      api.ts
      condition.ts
      nothing.ts
      code.ts
  utils/
    topologicalSort.ts
    mock/
      mockApi.ts
      mockCodeRunner.ts
  types/
    workflow.types.ts
  styles/
    globals.css
  App.tsx
  main.tsx
```

## Installation & Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Usage Guide

### Creating a Workflow

1. **Add Nodes**: Click node types in the left palette to add them to the canvas
2. **Connect Nodes**: Drag from output handles (right) to input handles (left)
3. **Configure Nodes**: Click a node to select it, then edit properties in the right panel
4. **Save**: Click "Save" to persist to localStorage
5. **Execute**: Click "Execute" to run the workflow

### Node Configuration Examples

#### Trigger Node
```json
{
  "triggerType": "MANUAL"
}
```

#### API Node (Mocked)
```json
{
  "url": "https://api.example.com/users",
  "method": "GET",
  "headers": {
    "Content-Type": "application/json"
  },
  "timeoutMs": 5000
}
```

#### Condition Node
```json
{
  "expression": "snapshot.nodeOutputs['api-1']?.response?.data?.value > 30"
}
```

#### Code Node (Mocked)
```json
{
  "code": "const result = snapshot.nodeOutputs; return result;",
  "timeoutMs": 1000
}
```

## Execution Engine Details

### ExecutionContext & Snapshot Behavior

The `ExecutionContext` maintains the state of all executed nodes:

```typescript
class ExecutionContext {
  nodeOutputs: Record<string, Record<string, any>>;
  runId: string;
  startTime: string;

  snapshot(): Readonly<ExecutionSnapshot> {
    // Returns frozen copy of current state
    // Prevents accidental mutations
    // Provides isolated view for each node
  }
}
```

**Key Points:**
- Each node receives a **read-only snapshot** of outputs from previously executed nodes
- Snapshots prevent nodes from modifying each other's outputs
- Topological sort ensures nodes execute in dependency order
- Condition nodes branch based on expression evaluation

### Execution Flow

1. **Validation**: Check for cycles, trigger node, required fields
2. **Topological Sort**: Determine execution order
3. **Sequential Execution**: 
   - Start from trigger node
   - For each node:
     - Get current snapshot
     - Check if node should execute (based on condition branches)
     - Execute node runner
     - Add result to context
     - Log to console
4. **Result**: Return execution results with timestamps and outputs

### Mock Implementations

**API Calls**: Return mock data based on HTTP method
```typescript
{
  status: 200,
  data: { success: true, value: 42 },
  mock: true
}
```

**Code Execution**: Return mock result without using `eval`
```typescript
{
  result: "mock-code-execution",
  inputSnapshot: snapshot
}
```

## Example Workflow

An example workflow is provided in `/example-workflow.json`:
- Manual trigger
- API call to fetch user data (mocked)
- Condition check on response value
- Code processing on success branch
- Do-nothing node on failure branch

Load it via the "Load" button in the toolbar.

## Validation Rules

- **Mandatory Trigger**: At least one trigger node required
- **API URL**: API nodes must have a valid URL
- **Condition Expression**: Must be valid JavaScript syntax
- **No Cycles**: Graph cannot contain circular dependencies

## Security Notes

- **No Real Network Calls**: API nodes use mocked responses
- **No eval()**: Code execution is simulated, not executed
- **localStorage Only**: No external data transmission
- **Client-Side Only**: Everything runs in the browser

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Flow**: Visual canvas
- **Zustand**: State management
- **Immer**: Immutable state updates
- **Lucide React**: Icons
- **Tailwind CSS 4.0**: Styling

## Future Enhancements

- Real API integration with authentication
- Sandboxed code execution (iframe/web worker)
- Version history
- Workflow templates
- Node cloning
- Undo/redo
- Export to JSON/YAML
- Import from other workflow engines
- Multi-user collaboration

## License

MIT
