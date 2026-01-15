#!/bin/bash

# Script to update imports for module refactoring
# Run from designer/src/app directory

echo "Updating imports for module refactoring..."

# Update shared module imports
find modules/shared_module -type f -name "*.ts" -exec sed -i '' \
  -e 's|@core/services/auth.service|@shared/services/auth.service|g' \
  -e 's|@core/guards/|@shared/guards/|g' \
  -e 's|@core/interceptors/|@shared/interceptors/|g' \
  -e 's|@core/models/|@shared/models/|g' \
  -e 's|@core/utils/|@shared/utils/|g' \
  -e 's|@shared/components/|@shared/components/|g' \
  -e 's|@layout/navbar/navbar.component|@shared/layout/navbar/navbar.component|g' \
  {} \;

# Update platform module imports
find modules/platform_module -type f -name "*.ts" -exec sed -i '' \
  -e 's|@core/services/auth.service|@shared/services/auth.service|g' \
  -e 's|@core/guards/|@shared/guards/|g' \
  -e 's|@core/models/|@shared/models/|g' \
  -e 's|@shared/components/|@shared/components/|g' \
  -e 's|@layout/navbar/platform-navbar|@platform/layout/navbar/platform-navbar|g' \
  {} \;

# Update client module imports  
find modules/client_module -type f -name "*.ts" -exec sed -i '' \
  -e 's|@core/services/auth.service|@shared/services/auth.service|g' \
  -e 's|@core/guards/|@shared/guards/|g' \
  -e 's|@core/models/|@shared/models/|g' \
  -e 's|@shared/components/|@shared/components/|g' \
  -e 's|@layout/navbar/client-navbar|@client/layout/navbar/client-navbar|g' \
  {} \;

# Update workflow module imports
find modules/workflow_module -type f -name "*.ts" -exec sed -i '' \
  -e 's|@core/services/auth.service|@shared/services/auth.service|g' \
  -e 's|@core/services/workflow-state.service|@workflow/services/workflow-state.service|g' \
  -e 's|@core/services/execution-engine.service|@workflow/services/execution-engine.service|g' \
  -e 's|@core/services/execution-context|@workflow/services/execution-context|g' \
  -e 's|@core/services/persistence.service|@workflow/services/persistence.service|g' \
  -e 's|@core/services/runners/|@workflow/services/runners/|g' \
  -e 's|@core/models/|@shared/models/|g' \
  -e 's|@core/utils/|@shared/utils/|g' \
  -e 's|@shared/components/|@shared/components/|g' \
  -e 's|@layout/navbar/user-navbar|@workflow/layout/navbar/user-navbar|g' \
  -e 's|@layout/toolbar|@workflow/layout/toolbar|g' \
  {} \;

echo "Import updates complete!"
echo "Please review the changes and test the application."
