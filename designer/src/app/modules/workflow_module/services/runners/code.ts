import { catchError, map, Observable, of } from 'rxjs';
import { CodeNodeConfig, ExecutionSnapshot, NodeRunResult } from '@shared/models/workflow.types';
import { mockCodeExecution } from '@shared/utils/mock/mock-code-runner';

export function runCodeNode(
  nodeId: string,
  config: CodeNodeConfig,
  snapshot: ExecutionSnapshot
): Observable<NodeRunResult> {
  if (!config.code || config.code.trim() === '') {
    return of({
      nodeId,
      outputs: {},
      status: 'failed',
      error: 'Code is required',
      timestamp: new Date().toISOString()
    });
  }

  return mockCodeExecution(config.code, snapshot, config.timeoutMs).pipe(
    map((result): NodeRunResult => ({
      nodeId,
      outputs: {
        result: result.result,
        inputSnapshot: result.inputSnapshot,
        executedAt: new Date().toISOString()
      },
      status: 'success',
      timestamp: new Date().toISOString()
    })),
    catchError((error): Observable<NodeRunResult> =>
      of({
        nodeId,
        outputs: {},
        status: 'failed',
        error: String(error),
        timestamp: new Date().toISOString()
      })
    )
  );
}

