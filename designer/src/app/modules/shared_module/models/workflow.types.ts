// Node Configuration Types
export type TriggerNodeConfig = {
  triggerType: 'MANUAL' | 'SCHEDULE' | 'WEBHOOK';
  cron?: string;
  webhookPath?: string;
};

// HTTP Request Node Configuration
export type HttpNodeConfig = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
};

export type ConditionNodeConfig = {
  expression: string;
};

export type DoNothingNodeConfig = {
  note?: string;
};

export type CodeNodeConfig = {
  code: string;
  timeoutMs?: number;
};

export type NodeConfig =
  | TriggerNodeConfig
  | HttpNodeConfig
  | ConditionNodeConfig
  | DoNothingNodeConfig
  | CodeNodeConfig;

// Node Types
export type NodeType = 'TRIGGER' | 'HTTP_REQUEST' | 'CONDITION' | 'DO_NOTHING' | 'CODE';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    config: NodeConfig;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

// Execution Types
export interface NodeRunResult {
  nodeId: string;
  outputs: Record<string, unknown>;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  timestamp: string;
}

export interface ExecutionSnapshot {
  nodeOutputs: Record<string, Record<string, unknown>>;
  runId: string;
  startTime: string;
}

export interface ExecutionResult {
  runId: string;
  results: NodeRunResult[];
}

