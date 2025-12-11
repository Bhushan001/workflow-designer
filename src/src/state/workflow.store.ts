import { create } from 'zustand';
import {
  WorkflowNode,
  WorkflowEdge,
  WorkflowDefinition,
  NodeRunResult,
} from '../types/workflow.types';

interface WorkflowStore {
  // Workflow state
  workflowId: string;
  workflowName: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;

  // Execution state
  executionResults: NodeRunResult[];
  executionLogs: string[];
  isExecuting: boolean;

  // Actions
  addNode: (node: WorkflowNode) => void;
  updateNode: (node: WorkflowNode) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (id: string) => void;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  setSelectedNodeId: (id: string | null) => void;

  // Workflow management
  loadWorkflow: (workflow: WorkflowDefinition) => void;
  exportWorkflow: () => WorkflowDefinition;
  newWorkflow: () => void;
  setWorkflowName: (name: string) => void;

  // Execution
  setExecutionResults: (results: NodeRunResult[]) => void;
  addExecutionLog: (log: string) => void;
  clearExecutionLogs: () => void;
  setIsExecuting: (isExecuting: boolean) => void;

  // Node Editor
  isNodeEditorOpen: boolean;
  openNodeEditor: () => void;
  closeNodeEditor: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  // Initial state
  workflowId: `workflow-${Date.now()}`,
  workflowName: 'New Workflow',
  nodes: [],
  edges: [],
  selectedNodeId: null,
  executionResults: [],
  executionLogs: [],
  isExecuting: false,
  isNodeEditorOpen: false,

  // Actions
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNode: (node) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === node.id ? node : n)),
    })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
    })),

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // Workflow management
  loadWorkflow: (workflow) =>
    set({
      workflowId: workflow.id,
      workflowName: workflow.name,
      nodes: workflow.nodes,
      edges: workflow.edges,
      selectedNodeId: null,
      executionResults: [],
      executionLogs: [],
    }),

  exportWorkflow: () => {
    const state = get();
    return {
      id: state.workflowId,
      name: state.workflowName,
      nodes: state.nodes,
      edges: state.edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  newWorkflow: () =>
    set({
      workflowId: `workflow-${Date.now()}`,
      workflowName: 'New Workflow',
      nodes: [],
      edges: [],
      selectedNodeId: null,
      executionResults: [],
      executionLogs: [],
    }),

  setWorkflowName: (name) => set({ workflowName: name }),

  // Execution
  setExecutionResults: (results) => set({ executionResults: results }),

  addExecutionLog: (log) =>
    set((state) => ({
      executionLogs: [...state.executionLogs, log],
    })),

  clearExecutionLogs: () => set({ executionLogs: [] }),

  setIsExecuting: (isExecuting) => set({ isExecuting }),

  // Node Editor
  openNodeEditor: () => set({ isNodeEditorOpen: true }),
  closeNodeEditor: () => set({ isNodeEditorOpen: false, selectedNodeId: null }),
}));