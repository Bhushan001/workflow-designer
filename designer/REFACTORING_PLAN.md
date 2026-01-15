# Refactoring Plan: Module-Based Structure

## New Structure

```
app/
├── modules/
│   ├── platform_module/     # PLATFORM_ADMIN
│   ├── client_module/        # CLIENT_ADMIN
│   ├── workflow_module/      # CLIENT_USER
│   └── shared_module/        # Common/shared code
├── core/                     # Keep minimal core (or merge to shared)
└── app.config.ts, app.routes.ts, etc.

```

## Migration Steps

### Phase 1: Shared Module
Move to `modules/shared_module/`:
- `shared/*` → `modules/shared_module/components/`
- `core/services/auth.service.ts` → `modules/shared_module/services/`
- `core/guards/*` → `modules/shared_module/guards/`
- `core/interceptors/*` → `modules/shared_module/interceptors/`
- `core/models/*` → `modules/shared_module/models/`
- `core/utils/*` → `modules/shared_module/utils/`
- `features/auth/*` → `modules/shared_module/pages/auth/`
- `features/home/*` → `modules/shared_module/pages/home/`
- `features/dashboard/pages/dashboard-redirect/` → `modules/shared_module/pages/dashboard-redirect/`
- `layout/navbar/navbar.component.*` → `modules/shared_module/layout/navbar/`

### Phase 2: Platform Module
Move to `modules/platform_module/`:
- `features/platform/*` → `modules/platform_module/pages/`
- `features/dashboard/pages/platform-dashboard/*` → `modules/platform_module/pages/dashboard/`
- `layout/navbar/platform-navbar/*` → `modules/platform_module/layout/navbar/`

### Phase 3: Client Module
Move to `modules/client_module/`:
- `features/client/*` → `modules/client_module/pages/`
- `features/dashboard/pages/client-dashboard/*` → `modules/client_module/pages/dashboard/`
- `layout/navbar/client-navbar/*` → `modules/client_module/layout/navbar/`

### Phase 4: Workflow Module
Move to `modules/workflow_module/`:
- `features/workflow/*` → `modules/workflow_module/pages/`
- `features/workflow-designer/*` → `modules/workflow_module/components/workflow-designer/` and `pages/workflow-designer/`
- `features/dashboard/pages/user-dashboard/*` → `modules/workflow_module/pages/dashboard/`
- `layout/navbar/user-navbar/*` → `modules/workflow_module/layout/navbar/`
- `layout/toolbar/*` → `modules/workflow_module/layout/toolbar/`
- `core/services/workflow-*.ts` → `modules/workflow_module/services/`
- `core/services/execution-*.ts` → `modules/workflow_module/services/`
- `core/services/runners/*` → `modules/workflow_module/services/runners/`
- `core/services/persistence.service.ts` → `modules/workflow_module/services/`

### Phase 5: Update Imports
Update all imports to use new paths:
- `@shared/*` → `@shared/*` (path updated)
- `@core/*` → `@shared/*` or `@workflow/*` as appropriate
- Update relative imports

### Phase 6: Update Routes
Update `app.routes.ts` with new import paths

### Phase 7: Clean Up
Remove old directories once everything is moved and working
