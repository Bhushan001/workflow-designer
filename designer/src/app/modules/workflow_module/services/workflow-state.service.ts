import { Injectable, signal, computed } from '@angular/core';
import {
  WorkflowNode,
  WorkflowEdge,
  WorkflowDefinition,
  NodeRunResult,
} from '@shared/models/workflow.types';

/**
 * Central state management service for workflow designer.
 * Uses Angular signals for reactive state management.
 */
@Injectable({
  providedIn: 'root',
})
export class WorkflowStateService {
  // Workflow state
  readonly workflowId = signal<string>(`workflow-${Date.now()}`);
  readonly workflowName = signal<string>('New Workflow');
  readonly nodes = signal<WorkflowNode[]>([]);
  readonly edges = signal<WorkflowEdge[]>([]);
  readonly selectedNodeId = signal<string | null>(null);

  // Execution state
  readonly executionResults = signal<NodeRunResult[]>([]);
  readonly executionLogs = signal<string[]>([]);
  readonly isExecuting = signal<boolean>(false);

  // Node Editor state
  readonly isNodeEditorOpen = signal<boolean>(false);

  // Computed signals for derived state
  readonly selectedNode = computed(() => {
    const selectedId = this.selectedNodeId();
    if (!selectedId) return null;
    return this.nodes().find((n) => n.id === selectedId) ?? null;
  });

  readonly hasNodes = computed(() => this.nodes().length > 0);

  readonly hasEdges = computed(() => this.edges().length > 0);

  readonly triggerNode = computed(() =>
    this.nodes().find((n) => n.type === 'TRIGGER')
  );

  // Node operations
  addNode(node: WorkflowNode): void {
    this.nodes.update((nodes) => [...nodes, node]);
  }

  updateNode(node: WorkflowNode): void {
    this.nodes.update((nodes) =>
      nodes.map((n) => (n.id === node.id ? node : n))
    );
  }

  removeNode(id: string): void {
    this.nodes.update((nodes) => nodes.filter((n) => n.id !== id));
    this.edges.update((edges) =>
      edges.filter((e) => e.source !== id && e.target !== id)
    );
    if (this.selectedNodeId() === id) {
      this.selectedNodeId.set(null);
    }
  }

  // Edge operations
  addEdge(edge: WorkflowEdge): void {
    this.edges.update((edges) => [...edges, edge]);
  }

  removeEdge(id: string): void {
    this.edges.update((edges) => edges.filter((e) => e.id !== id));
  }

  setNodes(nodes: WorkflowNode[]): void {
    this.nodes.set(nodes);
  }

  setEdges(edges: WorkflowEdge[]): void {
    this.edges.set(edges);
  }

  setSelectedNodeId(id: string | null): void {
    this.selectedNodeId.set(id);
  }

  // Workflow management
  loadWorkflow(workflow: WorkflowDefinition): void {
    this.workflowId.set(workflow.id);
    this.workflowName.set(workflow.name);
    this.nodes.set(workflow.nodes);
    this.edges.set(workflow.edges);
    this.selectedNodeId.set(null);
    this.executionResults.set([]);
    this.executionLogs.set([]);
  }

  exportWorkflow(): WorkflowDefinition {
    return {
      id: this.workflowId(),
      name: this.workflowName(),
      nodes: this.nodes(),
      edges: this.edges(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  newWorkflow(): void {
    this.workflowId.set(`workflow-${Date.now()}`);
    this.workflowName.set('New Workflow');
    this.nodes.set([]);
    this.edges.set([]);
    this.selectedNodeId.set(null);
    this.executionResults.set([]);
    this.executionLogs.set([]);
  }

  setWorkflowName(name: string): void {
    this.workflowName.set(name);
  }

  // Execution operations
  setExecutionResults(results: NodeRunResult[]): void {
    this.executionResults.set(results);
  }

  addExecutionLog(log: string): void {
    this.executionLogs.update((logs) => [...logs, log]);
  }

  clearExecutionLogs(): void {
    this.executionLogs.set([]);
  }

  setIsExecuting(isExecuting: boolean): void {
    this.isExecuting.set(isExecuting);
  }

  // Node Editor operations
  openNodeEditor(): void {
    this.isNodeEditorOpen.set(true);
  }

  closeNodeEditor(): void {
    this.isNodeEditorOpen.set(false);
    this.selectedNodeId.set(null);
  }
}

