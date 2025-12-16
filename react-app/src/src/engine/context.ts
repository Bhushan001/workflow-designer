import { NodeRunResult, ExecutionSnapshot } from '../types/workflow.types';

export class ExecutionContext {
  nodeOutputs: Record<string, Record<string, any>> = {};
  runId: string;
  startTime: string;

  constructor(runId: string) {
    this.runId = runId;
    this.startTime = new Date().toISOString();
  }

  addNodeResult(res: NodeRunResult): void {
    this.nodeOutputs[res.nodeId] = res.outputs;
  }

  getMergedPayload(): Record<string, any> {
    const merged: Record<string, any> = {};
    for (const [nodeId, outputs] of Object.entries(this.nodeOutputs)) {
      merged[nodeId] = outputs;
    }
    return merged;
  }

  snapshot(): Readonly<ExecutionSnapshot> {
    return Object.freeze({
      nodeOutputs: JSON.parse(JSON.stringify(this.nodeOutputs)),
      runId: this.runId,
      startTime: this.startTime,
    });
  }
}
