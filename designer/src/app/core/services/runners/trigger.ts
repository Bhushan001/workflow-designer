import { Observable, of } from 'rxjs';
import { ExecutionSnapshot, NodeRunResult, TriggerNodeConfig } from '../../models/workflow.types';

export function runTriggerNode(
  nodeId: string,
  config: TriggerNodeConfig,
  snapshot: ExecutionSnapshot
): Observable<NodeRunResult> {
  return of({
    nodeId,
    outputs: {
      triggerType: config.triggerType,
      triggeredAt: new Date().toISOString(),
      snapshot
    },
    status: 'success',
    timestamp: new Date().toISOString()
  });
}

