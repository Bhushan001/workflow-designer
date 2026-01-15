import { Observable, of } from 'rxjs';
import { DoNothingNodeConfig, ExecutionSnapshot, NodeRunResult } from '@shared/models/workflow.types';

export function runDoNothingNode(
  nodeId: string,
  _config: DoNothingNodeConfig,
  snapshot: ExecutionSnapshot
): Observable<NodeRunResult> {
  return of({
    nodeId,
    outputs: {
      note: 'No operation performed',
      snapshot,
      executedAt: new Date().toISOString()
    },
    status: 'success',
    timestamp: new Date().toISOString()
  });
}

