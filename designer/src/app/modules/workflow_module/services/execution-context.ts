import { ExecutionSnapshot, NodeRunResult } from '@shared/models/workflow.types';

export class ExecutionContext {
  nodeOutputs: Record<string, Record<string, unknown>> = {};
  readonly runId: string;
  readonly startTime: string;

  constructor(runId: string) {
    this.runId = runId;
    this.startTime = new Date().toISOString();
  }

  addNodeResult(res: NodeRunResult): void {
    this.nodeOutputs[res.nodeId] = res.outputs;
  }

  snapshot(): Readonly<ExecutionSnapshot> {
    return Object.freeze({
      nodeOutputs: JSON.parse(JSON.stringify(this.nodeOutputs)),
      runId: this.runId,
      startTime: this.startTime
    });
  }
}

