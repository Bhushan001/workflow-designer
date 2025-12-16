# Angular Migration Plan — "designer" (Angular 19)

This document outlines the professional approach to migrate the existing React/Vite workflow designer into a new Angular 19 application named `designer`.

## Goals
- Recreate the current workflow designer UI/UX and behavior in Angular with feature parity
- Preserve execution engine logic, mock runners, and stateful interactions
- Improve structure for long-term maintainability, testability, and scalability
- Follow Angular best practices and modern patterns (signals, standalone components)
- Establish a solid foundation for future enhancements

## Architecture Overview

### Folder Structure
```
designer/
├── src/
│   ├── app/
│   │   ├── core/                    # Core functionality (singleton services)
│   │   │   ├── models/              # Domain models and types
│   │   │   ├── services/            # Core services (state, execution, persistence)
│   │   │   ├── guards/              # Route guards
│   │   │   ├── interceptors/         # HTTP interceptors (if needed)
│   │   │   └── utils/               # Pure utility functions
│   │   ├── shared/                   # Shared components, directives, pipes
│   │   │   ├── components/          # Reusable UI components
│   │   │   ├── directives/          # Custom directives
│   │   │   ├── pipes/               # Custom pipes
│   │   │   └── interfaces/          # Shared interfaces
│   │   ├── features/                # Feature modules
│   │   │   ├── workflow-designer/   # Main workflow designer feature
│   │   │   │   ├── components/      # Feature-specific components
│   │   │   │   ├── services/        # Feature-specific services
│   │   │   │   └── models/          # Feature-specific models
│   │   │   └── ...
│   │   ├── layout/                  # Layout components
│   │   │   ├── shell/              # Main shell component
│   │   │   ├── toolbar/            # Toolbar component
│   │   │   └── panels/             # Side panels
│   │   └── app.config.ts           # App configuration
│   ├── assets/                      # Static assets
│   ├── environments/                # Environment configs
│   └── styles/                      # Global styles
│       ├── _variables.scss         # SCSS variables
│       ├── _mixins.scss            # SCSS mixins
│       └── styles.scss             # Main stylesheet
├── .editorconfig
├── .eslintrc.json
├── .prettierrc
├── angular.json
├── package.json
└── tsconfig.json
```

### Technical Decisions

#### State Management
**Decision: Angular Signals + Injectable Services**
- Use Angular signals for reactive state management
- Create `WorkflowStateService` as an injectable singleton
- Use computed signals for derived state
- Benefits: Native Angular, lightweight, excellent TypeScript support, no external dependencies

#### Graph/Canvas Library
**Decision: ngx-graph (primary) with fallback evaluation**
- Primary: `@swimlane/ngx-graph` - Native Angular, well-maintained, good feature set
- Alternative: Custom D3.js implementation if ngx-graph limitations found
- Evaluation criteria: node rendering, edge connections, zoom/pan, performance

#### Styling Strategy
**Decision: Bootstrap 5 + SCSS for component-specific styles**
- Bootstrap 5 for responsive grid system, components, and utilities
- SCSS for component-scoped styles and custom overrides
- Use Bootstrap's CSS variables for theming
- Custom SCSS variables for project-specific design tokens
- Benefits: Mature framework, extensive component library, good documentation, large community

#### Icon Strategy
**Decision: Font Awesome (Free version)**
- Comprehensive icon library with thousands of icons
- Well-established and widely used
- Good Angular integration via `@fortawesome/angular-fontawesome`
- Free tier provides solid icon coverage
- Benefits: Extensive icon set, consistent styling, good browser support

#### Testing Strategy
- Unit tests: Jasmine + Karma (Angular default)
- Component tests: Angular Testing Library (preferred) or TestBed
- E2E tests: Cypress or Playwright (TBD)
- Coverage target: 80% for core services, 60% for components

## High-Level Phases

### Phase 1: Project Bootstrap & Configuration
**Goal**: Establish a solid foundation with professional tooling

1. **Angular Workspace Setup**
   - Create Angular 19 app with standalone components, routing, SCSS, strict mode
   - Configure TypeScript paths (`@app/*`, `@core/*`, `@shared/*`)
   - Set up environment configurations

2. **Code Quality Tools**
   - ESLint with Angular-specific rules
   - Prettier for code formatting
   - EditorConfig for consistent editor settings
   - Husky + lint-staged (optional, for pre-commit hooks)

3. **Build & Development**
   - Configure Angular build optimizations
   - Set up development server configuration
   - Configure source maps for debugging

### Phase 2: Design System & Styling
**Goal**: Establish consistent visual design and styling infrastructure

1. **Bootstrap 5 Integration**
   - Install Bootstrap 5 and Bootstrap Icons (or Font Awesome)
   - Import Bootstrap SCSS files into `styles.scss`
   - Configure Bootstrap variables for custom theming
   - Set up Bootstrap's JavaScript (if using interactive components)

2. **Design Tokens**
   - Port color palette from React app to Bootstrap variables
   - Override Bootstrap's default color scheme
   - Define typography scale using Bootstrap's typography utilities
   - Establish spacing system using Bootstrap's spacing utilities
   - Create custom shadow/elevation classes if needed

3. **Global Styles**
   - Port `globals.css` to `styles.scss`
   - Import Bootstrap's base styles
   - Define custom base component styles
   - Create project-specific utility classes
   - Override Bootstrap defaults where necessary

4. **Icon System**
   - Install and configure Font Awesome (`@fortawesome/angular-fontawesome`)
   - Set up Font Awesome icon library
   - Create icon component wrapper for consistent usage
   - Document icon usage patterns and available icons

### Phase 3: Core Domain & Services
**Goal**: Implement business logic and domain models

1. **Domain Models** (`core/models/`)
   - Port `workflow.types.ts` to Angular interfaces/types
   - Create type guards for runtime type checking
   - Add JSDoc comments for better IDE support

2. **Execution Engine** (`core/services/`)
   - Port `ExecutionContext` class
   - Port `ExecutionEngine` service
   - Implement validation logic
   - Add error handling and logging

3. **Node Runners** (`core/services/runners/`)
   - Port all node runner functions (trigger, API, condition, code, do-nothing)
   - Maintain mock implementations
   - Add comprehensive error handling

4. **Utilities** (`core/utils/`)
   - Port topological sort algorithm
   - Port mock API and code runner utilities
   - Add validation helpers
   - Create data transformation utilities

### Phase 4: State Management
**Goal**: Implement reactive state management

1. **Workflow State Service** (`core/services/workflow-state.service.ts`)
   - Create injectable service with signals
   - Implement state properties (nodes, edges, selection, execution state)
   - Create computed signals for derived state
   - Add state mutation methods

2. **Persistence Service** (`core/services/persistence.service.ts`)
   - Implement localStorage operations
   - Add workflow import/export functionality
   - Handle serialization/deserialization
   - Add error handling for storage operations

3. **State Integration**
   - Wire state service into components
   - Implement state selectors (computed signals)
   - Add state persistence hooks

### Phase 5: UI Components - Foundation
**Goal**: Build the application shell and layout

1. **Layout Components** (`layout/`)
   - Shell component (main container)
   - Toolbar component (actions, workflow name)
   - Panel components (collapsible side panels)

2. **Shared Components** (`shared/components/`)
   - Button component (with variants)
   - Input component
   - Card component
   - Modal/Dialog component
   - Context menu component

### Phase 6: UI Components - Core Features
**Goal**: Implement main workflow designer features

1. **Node Palette** (`features/workflow-designer/components/palette/`)
   - List of available node types
   - Add node functionality
   - Visual node type indicators

2. **Workflow Canvas** (`features/workflow-designer/components/canvas/`)
   - Integrate ngx-graph
   - Implement node rendering (custom node components)
   - Edge connection handling
   - Zoom and pan controls
   - Context menu integration
   - Node selection and positioning

3. **Node Components** (`features/workflow-designer/components/nodes/`)
   - Trigger node component
   - API node component
   - Condition node component
   - Code node component
   - Do Nothing node component

4. **Properties Panel** (`features/workflow-designer/components/properties/`)
   - Dynamic form rendering based on node type
   - Reactive forms with validation
   - Node configuration forms (Trigger, API, Condition, Code, Do Nothing)
   - Node label editing

5. **Node Editor** (`features/workflow-designer/components/node-editor/`)
   - Full-screen node editor layout
   - Previous node response viewer
   - Current node response viewer
   - Node execution button

6. **Execution Console** (`features/workflow-designer/components/console/`)
   - Log display with auto-scroll
   - Status indicators (success, failed, skipped)
   - Timestamp formatting
   - Log filtering (optional)

### Phase 7: Integration & Workflow
**Goal**: Connect all components and implement workflow operations

1. **Workflow Operations**
   - New workflow creation
   - Save workflow to localStorage
   - Load workflow from localStorage
   - Export workflow as JSON
   - Import workflow from JSON

2. **Execution Integration**
   - Wire execution engine to UI
   - Implement full workflow execution
   - Implement single node execution
   - Display execution results
   - Handle execution errors

3. **User Interactions**
   - Node drag and drop
   - Edge creation and deletion
   - Node selection and editing
   - Context menu actions
   - Keyboard shortcuts

### Phase 8: Testing
**Goal**: Ensure code quality and reliability

1. **Unit Tests**
   - Core services (execution engine, state, persistence)
   - Node runners
   - Utilities (topological sort, validators)
   - Target: 80% coverage

2. **Component Tests**
   - Critical UI components (palette, properties, console)
   - Form validation
   - User interactions
   - Target: 60% coverage

3. **Integration Tests**
   - Workflow creation flow
   - Node connection flow
   - Execution flow
   - Save/load flow

4. **E2E Tests** (Optional)
   - Complete workflow: create → connect → execute
   - Branch scenarios (condition nodes)
   - Error handling scenarios

### Phase 9: Performance & Polish
**Goal**: Optimize performance and enhance user experience

1. **Performance Optimization**
   - Implement OnPush change detection strategy
   - Add trackBy functions for *ngFor loops
   - Lazy load heavy components (if needed)
   - Optimize bundle size
   - Implement virtual scrolling for large lists (if needed)

2. **Accessibility**
   - ARIA labels and roles
   - Keyboard navigation
   - Focus management
   - Screen reader support
   - Color contrast compliance

3. **User Experience**
   - Loading states
   - Error messages and handling
   - Success feedback
   - Disabled states
   - Hover and focus states
   - Animations and transitions

4. **Code Quality**
   - Remove console.logs
   - Add JSDoc comments
   - Refactor complex methods
   - Optimize imports
   - Remove unused code

### Phase 10: Documentation & Handoff
**Goal**: Document the application for future maintenance

1. **Code Documentation**
   - README.md with setup instructions
   - API documentation (JSDoc)
   - Architecture decision records (ADRs)
   - Component usage examples

2. **Developer Documentation**
   - CONTRIBUTING.md with coding standards
   - Testing guidelines
   - Deployment process
   - Troubleshooting guide

3. **Migration Notes**
   - Differences from React version
   - Known limitations
   - Future enhancements
   - Breaking changes (if any)

## Detailed Task Checklist

### Phase 1: Bootstrap
- [ ] Create Angular 19 app: `ng new designer --standalone --routing --style=scss --strict`
- [ ] Configure TypeScript path aliases (`@app/*`, `@core/*`, `@shared/*`)
- [ ] Set up ESLint with Angular rules
- [ ] Configure Prettier
- [ ] Add EditorConfig
- [ ] Configure environment files (development, production)
- [ ] Set up build configurations
- [ ] Verify build and serve commands work

### Phase 2: Design System
- [ ] Install Bootstrap 5 (`bootstrap` package)
- [ ] Install Font Awesome (`@fortawesome/fontawesome-free` or `@fortawesome/angular-fontawesome`)
- [ ] Import Bootstrap SCSS in `styles.scss`
- [ ] Configure Bootstrap variables for custom theming
- [ ] Port color palette to Bootstrap SCSS variables
- [ ] Port global styles to `styles.scss`
- [ ] Set up Font Awesome icon library
- [ ] Create icon component wrapper (optional)
- [ ] Test styling system with sample component

### Phase 3: Core Domain
- [ ] Create `core/models/workflow.types.ts` with all interfaces
- [ ] Add type guards for runtime type checking
- [ ] Port `topological-sort.ts` utility
- [ ] Port `mock-api.ts` utility
- [ ] Port `mock-code-runner.ts` utility
- [ ] Create `ExecutionContext` class
- [ ] Create `ExecutionEngineService` with full logic
- [ ] Port all node runners (trigger, API, condition, code, nothing)
- [ ] Add comprehensive error handling
- [ ] Write unit tests for core services

### Phase 4: State Management
- [ ] Create `WorkflowStateService` with signals
- [ ] Implement state properties (workflowId, name, nodes, edges, selection)
- [ ] Implement execution state (results, logs, isExecuting)
- [ ] Implement node editor state (isOpen)
- [ ] Create computed signals for derived state
- [ ] Implement state mutation methods
- [ ] Create `PersistenceService` for localStorage
- [ ] Implement save/load/export/import methods
- [ ] Add error handling for persistence
- [ ] Write unit tests for state service

### Phase 5: Foundation UI
- [ ] Create shell layout component
- [ ] Create toolbar component with actions
- [ ] Create panel components (left/right)
- [ ] Create shared button component
- [ ] Create shared input component
- [ ] Create shared card component
- [ ] Create shared dialog/modal component
- [ ] Create context menu component
- [ ] Style components with Bootstrap 5 classes and custom SCSS

### Phase 6: Core Features
- [ ] Create node palette component
- [ ] Implement add node functionality
- [ ] Install and configure ngx-graph
- [ ] Create workflow canvas component
- [ ] Create custom node components (5 types)
- [ ] Implement edge connection handling
- [ ] Implement zoom/pan controls
- [ ] Implement context menu for nodes
- [ ] Create properties panel component
- [ ] Create node type-specific form components
- [ ] Implement reactive forms with validation
- [ ] Create node editor component
- [ ] Create execution console component
- [ ] Implement auto-scroll for console

### Phase 7: Integration
- [ ] Wire state service to all components
- [ ] Implement new workflow action
- [ ] Implement save workflow action
- [ ] Implement load workflow action
- [ ] Implement export workflow action
- [ ] Implement import workflow action
- [ ] Wire execution engine to UI
- [ ] Implement full workflow execution
- [ ] Implement single node execution
- [ ] Display execution results
- [ ] Handle execution errors gracefully

### Phase 8: Testing
- [ ] Write unit tests for execution engine
- [ ] Write unit tests for node runners
- [ ] Write unit tests for state service
- [ ] Write unit tests for persistence service
- [ ] Write component tests for palette
- [ ] Write component tests for properties panel
- [ ] Write component tests for console
- [ ] Write integration tests for workflows
- [ ] Set up E2E testing framework (optional)
- [ ] Achieve coverage targets

### Phase 9: Polish
- [ ] Apply OnPush change detection
- [ ] Add trackBy functions
- [ ] Implement loading states
- [ ] Add error messages
- [ ] Implement keyboard shortcuts
- [ ] Add ARIA labels
- [ ] Test accessibility
- [ ] Optimize bundle size
- [ ] Performance profiling
- [ ] UX polish pass

### Phase 10: Documentation
- [ ] Write comprehensive README.md
- [ ] Document architecture decisions
- [ ] Create CONTRIBUTING.md
- [ ] Add JSDoc comments to public APIs
- [ ] Create migration notes
- [ ] Document known limitations
- [ ] Create deployment guide

## Dependencies

### Production Dependencies
- `@angular/*` (v19.2.0+) - Angular framework
- `@swimlane/ngx-graph` - Graph visualization library
- `@fortawesome/angular-fontawesome` - Font Awesome Angular integration
- `@fortawesome/fontawesome-free` - Font Awesome icon library (or use CDN)
- `bootstrap` - Bootstrap 5 CSS framework
- `rxjs` - Reactive extensions

### Development Dependencies
- `@angular-eslint/*` - ESLint for Angular
- `@typescript-eslint/*` - TypeScript ESLint rules
- `eslint` - Linting
- `prettier` - Code formatting

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` when necessary)
- Comprehensive type definitions
- Interface over type aliases for objects

### Angular
- Standalone components (no NgModules)
- Signals for reactive state
- OnPush change detection strategy
- Dependency injection for services
- Reactive forms for user input

### Testing
- Unit tests for all services
- Component tests for UI components
- Integration tests for workflows
- Minimum 80% coverage for core services
- Minimum 60% coverage for components

### Code Style
- ESLint for linting
- Prettier for formatting
- Consistent naming conventions
- Meaningful variable and function names
- JSDoc comments for public APIs

## Risk Mitigation

### Technical Risks
1. **Graph Library Limitations**: Evaluate ngx-graph early; have D3.js fallback plan
2. **Performance with Large Workflows**: Implement virtualization if needed
3. **State Management Complexity**: Start simple with signals; refactor if needed

### Migration Risks
1. **Feature Parity**: Maintain checklist comparing React vs Angular features
2. **User Experience**: Conduct usability testing to ensure parity
3. **Timeline**: Break work into small, testable increments

## Success Criteria

- ✅ All React app features replicated in Angular
- ✅ Execution engine produces identical results
- ✅ UI/UX matches or improves upon React version
- ✅ Code coverage meets targets
- ✅ Build and deployment process established
- ✅ Documentation complete
- ✅ Performance meets or exceeds React version

## Timeline Estimate

- **Phase 1-2**: 1-2 days (Bootstrap & Design System)
- **Phase 3-4**: 2-3 days (Core Domain & State)
- **Phase 5-6**: 5-7 days (UI Components)
- **Phase 7**: 2-3 days (Integration)
- **Phase 8**: 3-4 days (Testing)
- **Phase 9**: 2-3 days (Polish)
- **Phase 10**: 1-2 days (Documentation)

**Total Estimate**: 18-24 days (assuming full-time development)

## Notes

- Keep React app as reference implementation
- Test each phase before moving to next
- Maintain feature parity checklist
- Document architectural decisions
- Regular code reviews (if team environment)
