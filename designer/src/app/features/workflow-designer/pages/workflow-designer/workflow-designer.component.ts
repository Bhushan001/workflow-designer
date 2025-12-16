import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStateService } from '@core/services/workflow-state.service';
import { PersistenceService } from '@core/services/persistence.service';
import { ExecutionEngineService } from '@core/services/execution-engine.service';
import { ToolbarComponent } from '@layout/toolbar/toolbar.component';
import { NodePaletteComponent } from '../../components/palette/node-palette/node-palette.component';
import { WorkflowCanvasComponent } from '../../components/canvas/workflow-canvas/workflow-canvas.component';
import { NodeEditorComponent } from '../../components/node-editor/node-editor/node-editor.component';
import {
  NodeType,
  WorkflowNode,
  TriggerNodeConfig,
  HttpNodeConfig,
  ConditionNodeConfig,
  DoNothingNodeConfig,
  CodeNodeConfig,
} from '@core/models/workflow.types';

@Component({
  selector: 'app-workflow-designer',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    NodePaletteComponent,
    WorkflowCanvasComponent,
    NodeEditorComponent,
  ],
  templateUrl: './workflow-designer.component.html',
  styleUrl: './workflow-designer.component.scss',
})
export class WorkflowDesignerComponent implements OnInit {
  constructor(
    public stateService: WorkflowStateService,
    private persistenceService: PersistenceService,
    private executionEngine: ExecutionEngineService
  ) {}

  ngOnInit(): void {
    // Try to load current workflow on init
    const currentWorkflow = this.persistenceService.loadCurrentWorkflow();
    if (currentWorkflow) {
      this.stateService.loadWorkflow(currentWorkflow);
    }
  }

  onAddNode(type: NodeType): void {
    const nodeId = `${type.toLowerCase()}-${Date.now()}`;

    // Default configs for each node type
    const defaultConfigs: Record<NodeType, any> = {
      TRIGGER: { triggerType: 'MANUAL' } as TriggerNodeConfig,
      CIBIL: { url: '', method: 'POST', timeoutMs: 30000 } as HttpNodeConfig,
      CRIF: { url: '', method: 'POST', timeoutMs: 30000 } as HttpNodeConfig,
      EXPERIAN: { url: '', method: 'POST', timeoutMs: 30000 } as HttpNodeConfig,
      EQUIFIX: { url: '', method: 'POST', timeoutMs: 30000 } as HttpNodeConfig,
      CONDITION: { expression: 'true' } as ConditionNodeConfig,
      DO_NOTHING: { note: '' } as DoNothingNodeConfig,
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
    if (confirm('Create a new workflow? Unsaved changes will be lost.')) {
      this.stateService.newWorkflow();
      this.stateService.clearExecutionLogs();
      this.persistenceService.clearCurrentWorkflow();
    }
  }

  onSaveWorkflow(): void {
    const workflow = this.stateService.exportWorkflow();
    if (this.persistenceService.saveWorkflow(workflow)) {
      this.persistenceService.saveCurrentWorkflow(workflow);
      this.stateService.addExecutionLog(
        `[${new Date().toLocaleTimeString()}] Workflow saved to localStorage`
      );
      alert('Workflow saved successfully!');
    } else {
      alert('Failed to save workflow');
    }
  }

  onLoadWorkflow(): void {
    const workflows = this.persistenceService.getAllWorkflows();
    if (workflows.length === 0) {
      alert('No saved workflows found');
      return;
    }

    // Simple: load the first workflow (can be enhanced with a selection dialog)
    const workflow = workflows[0];
    this.stateService.loadWorkflow(workflow);
    this.persistenceService.saveCurrentWorkflow(workflow);
    this.stateService.addExecutionLog(
      `[${new Date().toLocaleTimeString()}] Workflow loaded from localStorage`
    );
    alert('Workflow loaded successfully!');
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
