import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowStateService } from '@workflow/services/workflow-state.service';
import { PersistenceService } from '@workflow/services/persistence.service';
import { ExecutionEngineService } from '@workflow/services/execution-engine.service';
import { WorkflowApiService } from '@workflow/services/workflow-api.service';
import { ToolbarComponent } from '@workflow/layout/toolbar/toolbar.component';
import { UserNavbarComponent } from '@workflow/layout/navbar/user-navbar/user-navbar.component';
import { NodePaletteComponent } from '../../components/workflow-designer/components/palette/node-palette/node-palette.component';
import { WorkflowCanvasComponent } from '../../components/workflow-designer/components/canvas/workflow-canvas/workflow-canvas.component';
import { NodeEditorComponent } from '../../components/workflow-designer/components/node-editor/node-editor/node-editor.component';
import { ToastService } from '@shared/services/toast.service';
import { AuthService } from '@shared/services/auth.service';
import { extractErrorMessage } from '@shared/utils/error.utils';
import {
  NodeType,
  WorkflowNode,
  TriggerNodeConfig,
  HttpNodeConfig,
  ConditionNodeConfig,
  DoNothingNodeConfig,
  CodeNodeConfig,
  WebhookTriggerConfig,
  ScheduleTriggerConfig,
  EmailTriggerConfig,
  FileWatcherTriggerConfig,
  DatabaseQueryConfig,
  EmailSendConfig,
  FileOperationConfig,
  TransformConfig,
  WaitConfig,
  SetVariableConfig,
  LogConfig,
  NotificationConfig,
  WebhookCallConfig,
  SftpConfig,
  SwitchConfig,
  LoopConfig,
  MergeConfig,
  JsonParseConfig,
  JsonStringifyConfig,
  ArrayOperationConfig,
  StringOperationConfig,
  ValidateConfig,
  ApiIntegrationConfig,
  SlackConfig,
  GithubConfig,
  CustomIntegrationConfig,
  ErrorHandlerConfig,
  FunctionConfig,
} from '@shared/models/workflow.types';

@Component({
  selector: 'app-workflow-designer',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    UserNavbarComponent,
    NodePaletteComponent,
    WorkflowCanvasComponent,
    NodeEditorComponent,
  ],
  templateUrl: './workflow-designer.component.html',
  styleUrl: './workflow-designer.component.scss',
})
export class WorkflowDesignerComponent implements OnInit {
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workflowApiService = inject(WorkflowApiService);

  constructor(
    public stateService: WorkflowStateService,
    private persistenceService: PersistenceService,
    private executionEngine: ExecutionEngineService
  ) {}

  ngOnInit(): void {
    // Check if workflow ID is provided in query params (from edit action)
    this.route.queryParams.subscribe(params => {
      const workflowId = params['id'];
      const currentWorkflowId = this.stateService.workflowId();
      
      if (workflowId) {
        // Only load if it's a different workflow or if we don't have nodes loaded
        if (workflowId !== currentWorkflowId || this.stateService.nodes().length === 0) {
          // Load workflow from backend by ID
          this.loadWorkflowById(workflowId);
        }
      } else {
        // No query params - only clear if we don't have a workflow loaded
        // This prevents clearing the state when navigating after save
        if (!currentWorkflowId || currentWorkflowId.startsWith('workflow-')) {
          // This is a new workflow (temporary ID) or no workflow at all
          this.stateService.newWorkflow();
          this.persistenceService.clearCurrentWorkflow();
        }
        // If we have a saved workflow ID, keep the state (user might have removed query params manually)
      }
    });
  }

  /**
   * Load workflow from backend by ID
   */
  private loadWorkflowById(id: string): void {
    // Load the full Workflow entity (not just WorkflowDefinition) to get the database ID
    this.workflowApiService.getWorkflowById(id).subscribe({
      next: (response) => {
        const workflowEntity: any = response.body;
        
        if (workflowEntity) {
          // Parse workflowDefinition if it's a JSON string
          let workflowDefinition: any = null;
          if (workflowEntity.workflowDefinition) {
            if (typeof workflowEntity.workflowDefinition === 'string') {
              try {
                workflowDefinition = JSON.parse(workflowEntity.workflowDefinition);
              } catch (e) {
                console.error('Failed to parse workflowDefinition:', e);
                this.toastService.showToast('danger', 'Load Failed', 'Failed to parse workflow data.');
                return;
              }
            } else {
              workflowDefinition = workflowEntity.workflowDefinition;
            }
          }
          
          if (workflowDefinition) {
            // IMPORTANT: Use the database UUID (workflowEntity.id) not the workflowDefinition.id
            // The workflowDefinition.id might be an old temporary ID
            workflowDefinition.id = workflowEntity.id; // Override with database UUID
            workflowDefinition.name = workflowEntity.name || workflowDefinition.name;
            
            this.stateService.loadWorkflow(workflowDefinition);
            // Save to localStorage for auto-restore
            this.persistenceService.saveCurrentWorkflow(workflowDefinition);
            this.toastService.showToast('success', 'Workflow Loaded', 'Workflow loaded successfully!');
          } else {
            this.toastService.showToast('warning', 'Workflow Not Found', 'Workflow data not found.');
            this.router.navigate(['/designer'], { replaceUrl: true });
          }
        } else {
          this.toastService.showToast('warning', 'Workflow Not Found', 'Workflow not found. Creating new workflow.');
          this.router.navigate(['/designer'], { replaceUrl: true });
        }
      },
      error: (error) => {
        const errorMessage = extractErrorMessage(error);
        this.toastService.showToast('danger', 'Load Failed', errorMessage);
        console.error('Error loading workflow:', error);
        // Clear query params and start fresh
        this.router.navigate(['/designer'], { replaceUrl: true });
      },
    });
  }

  onAddNode(type: NodeType): void {
    const nodeId = `${type.toLowerCase()}-${Date.now()}`;

    // Default configs for each node type
    const defaultConfigs: Record<NodeType, any> = {
      // Triggers
      TRIGGER: { triggerType: 'MANUAL' } as TriggerNodeConfig,
      WEBHOOK_TRIGGER: { method: 'POST', path: '/webhook' } as WebhookTriggerConfig,
      SCHEDULE_TRIGGER: { cronExpression: '0 * * * *' } as ScheduleTriggerConfig,
      EMAIL_TRIGGER: { email: '' } as EmailTriggerConfig,
      FILE_WATCHER_TRIGGER: { directory: '', watchMode: 'all' } as FileWatcherTriggerConfig,
      // Actions
      HTTP_REQUEST: { url: '', method: 'POST', timeoutMs: 30000 } as HttpNodeConfig,
      DATABASE_QUERY: { connectionString: '', query: '' } as DatabaseQueryConfig,
      EMAIL_SEND: { to: [], subject: '', body: '' } as EmailSendConfig,
      FILE_OPERATION: { operation: 'read', sourcePath: '' } as FileOperationConfig,
      TRANSFORM: { transformationRules: [] } as TransformConfig,
      WAIT: { waitType: 'duration', durationMs: 1000 } as WaitConfig,
      SET_VARIABLE: { variables: [] } as SetVariableConfig,
      LOG: { level: 'info', message: '' } as LogConfig,
      NOTIFICATION: { type: 'email', recipients: [], title: '', message: '' } as NotificationConfig,
      WEBHOOK_CALL: { url: '', method: 'POST' } as WebhookCallConfig,
      SFTP: { operation: 'upload', host: '', username: '', sourcePath: '' } as SftpConfig,
      DO_NOTHING: { note: '' } as DoNothingNodeConfig,
      // Logic
      CONDITION: { expression: 'true' } as ConditionNodeConfig,
      SWITCH: { expression: '', cases: [] } as SwitchConfig,
      LOOP: { arrayPath: '', itemVariable: 'item' } as LoopConfig,
      MERGE: { mode: 'keep-all' } as MergeConfig,
      // Data/Transform
      JSON_PARSE: { jsonStringPath: '' } as JsonParseConfig,
      JSON_STRINGIFY: { inputPath: '' } as JsonStringifyConfig,
      ARRAY_OPERATION: { operation: 'filter', arrayPath: '' } as ArrayOperationConfig,
      STRING_OPERATION: { operation: 'concat', inputPath: '' } as StringOperationConfig,
      VALIDATE: { rules: [] } as ValidateConfig,
      // Integrations
      API_INTEGRATION: { apiTemplate: '', endpoint: '', method: 'GET' } as ApiIntegrationConfig,
      SLACK: { action: 'send-message', message: '' } as SlackConfig,
      GITHUB: { action: 'create-issue', repository: '' } as GithubConfig,
      CUSTOM_INTEGRATION: { integrationType: '', configuration: {} } as CustomIntegrationConfig,
      // Utilities
      ERROR_HANDLER: { fallbackAction: 'continue' } as ErrorHandlerConfig,
      FUNCTION: { functionType: 'math', expression: '' } as FunctionConfig,
      // Code
      CODE: { code: '// Your code here', timeoutMs: 1000 } as CodeNodeConfig,
    };

    const newNode: WorkflowNode = {
      id: nodeId,
      type,
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: `${type} Node`,
        config: defaultConfigs[type],
      },
    };

    this.stateService.addNode(newNode);
  }

  onNewWorkflow(): void {
    // Use a more professional confirmation approach
    const confirmed = window.confirm('Create a new workflow? Unsaved changes will be lost.');
    if (confirmed) {
      // Clear query params to ensure we start with a new workflow
      this.router.navigate(['/designer'], { replaceUrl: true });
      this.stateService.newWorkflow();
      this.stateService.clearExecutionLogs();
      this.persistenceService.clearCurrentWorkflow();
    }
  }

  onSaveWorkflow(): void {
    const workflow = this.stateService.exportWorkflow();
    const workflowName = this.stateService.workflowName();
    const workflowId = this.stateService.workflowId();
    const currentUser = this.authService.getCurrentUser();

    // Validate workflow name is not empty
    if (!workflowName || workflowName.trim().length === 0) {
      this.toastService.showToast('danger', 'Validation Error', 'Workflow name is required and cannot be empty.');
      return;
    }

    // Validate workflow name is not just "New Workflow"
    if (workflowName.trim() === 'New Workflow') {
      this.toastService.showToast('danger', 'Validation Error', 'Please provide a unique name for your workflow.');
      return;
    }

    // Get client ID from user profile if available
    const clientId = currentUser?.clientId;

    // Determine if this is a new workflow or update
    // If workflowId starts with "workflow-" it's a temporary ID (new workflow)
    // If workflowId is a UUID format (36 chars with hyphens), it's a database ID (existing workflow)
    // Otherwise, treat as new workflow
    const isUUID = workflowId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(workflowId);
    const isNewWorkflow = !workflowId || workflowId.startsWith('workflow-') || !isUUID;
    const workflowIdToUse = isNewWorkflow ? undefined : workflowId;

    this.stateService.setIsExecuting(true);
    this.persistenceService.saveWorkflow(workflow, workflowIdToUse, workflowName, undefined, clientId).subscribe({
      next: (savedWorkflow) => {
        this.stateService.setIsExecuting(false);
        if (savedWorkflow) {
          // Always update workflow ID and name in state after save
          if (savedWorkflow.id) {
            this.stateService.workflowId.set(savedWorkflow.id);
            workflow.id = savedWorkflow.id;
          }
          if (savedWorkflow.name) {
            this.stateService.workflowName.set(savedWorkflow.name);
            workflow.name = savedWorkflow.name;
          }
          
          // Update the state with the saved workflow to ensure it's in sync
          // The workflow object already contains the current nodes and edges from exportWorkflow()
          this.stateService.loadWorkflow(workflow);
          
          // Save to localStorage for auto-restore
          this.persistenceService.saveCurrentWorkflow(workflow);
          
          // Update URL query params if we have a workflow ID
          // Use replaceUrl to update without adding to history, and only if query params changed
          if (savedWorkflow.id) {
            const currentParams = this.route.snapshot.queryParams;
            if (currentParams['id'] !== savedWorkflow.id) {
              // Only navigate if the ID actually changed
              this.router.navigate(['/designer'], { 
                queryParams: { id: savedWorkflow.id },
                replaceUrl: true
              });
            }
          }
          
          this.stateService.addExecutionLog(
            `[${new Date().toLocaleTimeString()}] Workflow saved to database`
          );
          this.toastService.showToast('success', 'Workflow Saved', 'Workflow saved successfully!');
        } else {
          this.toastService.showToast('danger', 'Save Failed', 'Failed to save workflow. Please try again.');
        }
      },
      error: (error) => {
        this.stateService.setIsExecuting(false);
        const errorMessage = extractErrorMessage(error);
        this.toastService.showToast('danger', 'Save Failed', errorMessage);
        console.error('Error saving workflow:', error);
      },
    });
  }

  onLoadWorkflow(): void {
    // Load workflows from backend
    this.persistenceService.getAllWorkflows(0, 10).subscribe({
      next: (workflows) => {
        if (workflows.length === 0) {
          this.toastService.showToast('warning', 'No Workflows', 'No saved workflows found.');
          return;
        }

        // Simple: load the first workflow (can be enhanced with a selection dialog)
        const workflow = workflows[0];
        this.stateService.loadWorkflow(workflow);
        this.persistenceService.saveCurrentWorkflow(workflow);
        this.stateService.addExecutionLog(
          `[${new Date().toLocaleTimeString()}] Workflow loaded from database`
        );
        this.toastService.showToast('success', 'Workflow Loaded', 'Workflow loaded successfully!');
      },
      error: (error) => {
        const errorMessage = extractErrorMessage(error);
        this.toastService.showToast('danger', 'Load Failed', errorMessage);
        console.error('Error loading workflows:', error);
      },
    });
  }

  onExecute(): void {
    const nodes = this.stateService.nodes();
    const edges = this.stateService.edges();

    if (nodes.length === 0) {
      alert('Cannot execute: No nodes in workflow');
      return;
    }

    this.stateService.clearExecutionLogs();
    this.stateService.setIsExecuting(true);
    this.stateService.addExecutionLog(
      `[${new Date().toLocaleTimeString()}] ========== EXECUTION START ==========`
    );
    this.stateService.addExecutionLog(
      `[${new Date().toLocaleTimeString()}] Nodes: ${nodes.length}, Edges: ${edges.length}`
    );

    this.executionEngine.execute(nodes, edges).subscribe({
      next: (result) => {
        this.stateService.addExecutionLog(
          `[${new Date().toLocaleTimeString()}] Run ID: ${result.runId}`
        );

        result.results.forEach((nodeResult) => {
          const time = new Date(nodeResult.timestamp).toLocaleTimeString();
          const status = nodeResult.status.toUpperCase();
          const icon =
            nodeResult.status === 'success'
              ? '✓'
              : nodeResult.status === 'failed'
                ? '✗'
                : '⊘';

          this.stateService.addExecutionLog(
            `[${time}] ${icon} ${nodeResult.nodeId} - ${status}`
          );

          if (nodeResult.error) {
            this.stateService.addExecutionLog(`[${time}] Error: ${nodeResult.error}`);
          }
        });

        this.stateService.setExecutionResults(result.results);
        this.stateService.addExecutionLog(
          `[${new Date().toLocaleTimeString()}] ========== EXECUTION COMPLETE ==========`
        );
        this.stateService.setIsExecuting(false);
      },
      error: (error) => {
        this.stateService.addExecutionLog(
          `[${new Date().toLocaleTimeString()}] ✗ Execution failed: ${error.message}`
        );
        this.stateService.setIsExecuting(false);
        alert(`Execution failed: ${error.message}`);
      },
    });
  }

  onZoomIn(): void {
    // Handled by canvas component
  }

  onZoomOut(): void {
    // Handled by canvas component
  }

  onFitView(): void {
    // Handled by canvas component
  }
}
