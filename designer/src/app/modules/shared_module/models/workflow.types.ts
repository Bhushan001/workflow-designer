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

// Trigger Node Configurations
export type WebhookTriggerConfig = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH';
  path: string;
  authentication?: 'none' | 'basic' | 'bearer' | 'apiKey';
  authConfig?: Record<string, string>;
};

export type ScheduleTriggerConfig = {
  cronExpression: string;
  timezone?: string;
};

export type EmailTriggerConfig = {
  email: string;
  folder?: string;
  filters?: Record<string, string>;
};

export type FileWatcherTriggerConfig = {
  directory: string;
  pattern?: string;
  watchMode: 'create' | 'modify' | 'delete' | 'all';
};

// Action Node Configurations
export type DatabaseQueryConfig = {
  connectionString: string;
  query: string;
  parameters?: Record<string, unknown>;
  timeoutMs?: number;
};

export type EmailSendConfig = {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  bodyType?: 'text' | 'html';
  attachments?: string[];
};

export type FileOperationConfig = {
  operation: 'read' | 'write' | 'copy' | 'move' | 'delete' | 'list';
  sourcePath: string;
  destinationPath?: string;
  content?: string;
  encoding?: string;
};

export type TransformConfig = {
  transformationRules: Array<{
    inputPath: string;
    outputPath: string;
    expression?: string;
  }>;
};

export type WaitConfig = {
  waitType: 'duration' | 'until';
  durationMs?: number;
  untilDateTime?: string;
};

export type SetVariableConfig = {
  variables: Array<{
    name: string;
    value: unknown;
    scope?: 'workflow' | 'session';
  }>;
};

export type LogConfig = {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, unknown>;
};

export type NotificationConfig = {
  type: 'email' | 'push' | 'sms' | 'slack';
  recipients: string[];
  title: string;
  message: string;
  priority?: 'low' | 'normal' | 'high';
};

export type WebhookCallConfig = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
};

export type SftpConfig = {
  operation: 'upload' | 'download' | 'list' | 'delete';
  host: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
  sourcePath: string;
  destinationPath?: string;
};

// Logic Node Configurations
export type SwitchConfig = {
  expression: string;
  cases: Array<{
    value: string | number | boolean;
    label?: string;
  }>;
  defaultCase?: string;
};

export type LoopConfig = {
  arrayPath: string;
  itemVariable: string;
  indexVariable?: string;
};

export type MergeConfig = {
  mode: 'keep-all' | 'merge-by-key' | 'merge-by-index';
  keyField?: string;
};

// Data/Transform Node Configurations
export type JsonParseConfig = {
  jsonStringPath: string;
  outputPath?: string;
};

export type JsonStringifyConfig = {
  inputPath: string;
  outputPath?: string;
  prettyPrint?: boolean;
};

export type ArrayOperationConfig = {
  operation: 'filter' | 'map' | 'reduce' | 'sort' | 'find' | 'slice';
  arrayPath: string;
  expression?: string;
  outputPath?: string;
  sortDirection?: 'asc' | 'desc';
  startIndex?: number;
  endIndex?: number;
};

export type StringOperationConfig = {
  operation: 'concat' | 'split' | 'replace' | 'substring' | 'upper' | 'lower' | 'trim';
  inputPath: string;
  outputPath?: string;
  separator?: string;
  pattern?: string;
  replacement?: string;
  start?: number;
  end?: number;
};

export type ValidateConfig = {
  schema?: string; // JSON Schema
  rules?: Array<{
    field: string;
    rule: 'required' | 'min' | 'max' | 'pattern' | 'custom';
    value?: string | number;
    message?: string;
  }>;
};

// Integration Node Configurations
export type ApiIntegrationConfig = {
  apiTemplate: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  parameters?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export type SlackConfig = {
  action: 'send-message' | 'create-channel' | 'update-message';
  webhookUrl?: string;
  channel?: string;
  message: string;
  username?: string;
  iconEmoji?: string;
};

export type GithubConfig = {
  action: 'create-issue' | 'create-pr' | 'list-issues' | 'update-issue';
  repository: string;
  token?: string;
  title?: string;
  body?: string;
  labels?: string[];
};

export type CustomIntegrationConfig = {
  integrationType: string;
  configuration: Record<string, unknown>;
};

// Utility Node Configurations
export type ErrorHandlerConfig = {
  errorTypes?: string[];
  fallbackAction?: 'continue' | 'retry' | 'abort';
  retryCount?: number;
  retryDelayMs?: number;
};

export type FunctionConfig = {
  functionType: 'math' | 'string' | 'date' | 'custom';
  expression: string;
  parameters?: Array<{
    name: string;
    value: unknown;
  }>;
};

export type NodeConfig =
  // Triggers
  | TriggerNodeConfig
  | WebhookTriggerConfig
  | ScheduleTriggerConfig
  | EmailTriggerConfig
  | FileWatcherTriggerConfig
  // Actions
  | HttpNodeConfig
  | DatabaseQueryConfig
  | EmailSendConfig
  | FileOperationConfig
  | TransformConfig
  | WaitConfig
  | SetVariableConfig
  | LogConfig
  | NotificationConfig
  | WebhookCallConfig
  | SftpConfig
  | DoNothingNodeConfig
  // Logic
  | ConditionNodeConfig
  | SwitchConfig
  | LoopConfig
  | MergeConfig
  // Data/Transform
  | JsonParseConfig
  | JsonStringifyConfig
  | ArrayOperationConfig
  | StringOperationConfig
  | ValidateConfig
  // Integrations
  | ApiIntegrationConfig
  | SlackConfig
  | GithubConfig
  | CustomIntegrationConfig
  // Utilities
  | ErrorHandlerConfig
  | FunctionConfig
  // Code
  | CodeNodeConfig;

// Node Types
export type NodeType = 
  // Triggers
  | 'TRIGGER' 
  | 'WEBHOOK_TRIGGER' 
  | 'SCHEDULE_TRIGGER' 
  | 'EMAIL_TRIGGER' 
  | 'FILE_WATCHER_TRIGGER'
  // Actions
  | 'HTTP_REQUEST' 
  | 'DATABASE_QUERY'
  | 'EMAIL_SEND'
  | 'FILE_OPERATION'
  | 'TRANSFORM'
  | 'WAIT'
  | 'SET_VARIABLE'
  | 'LOG'
  | 'NOTIFICATION'
  | 'WEBHOOK_CALL'
  | 'SFTP'
  | 'DO_NOTHING'
  // Logic
  | 'CONDITION' 
  | 'SWITCH'
  | 'LOOP'
  | 'MERGE'
  // Data/Transform
  | 'JSON_PARSE'
  | 'JSON_STRINGIFY'
  | 'ARRAY_OPERATION'
  | 'STRING_OPERATION'
  | 'VALIDATE'
  // Integrations
  | 'API_INTEGRATION'
  | 'SLACK'
  | 'GITHUB'
  | 'CUSTOM_INTEGRATION'
  // Utilities
  | 'ERROR_HANDLER'
  | 'FUNCTION'
  // Code
  | 'CODE';

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

