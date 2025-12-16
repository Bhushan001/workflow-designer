import { catchError, map, Observable, of } from 'rxjs';
import { HttpNodeConfig, ExecutionSnapshot, NodeRunResult } from '../../models/workflow.types';
import { mockHttpCall } from '../../utils/mock/mock-api';

export function runHttpNode(
  nodeId: string,
  config: HttpNodeConfig,
  snapshot: ExecutionSnapshot
): Observable<NodeRunResult> {
  if (!config.url || config.url.trim() === '') {
    return of({
      nodeId,
      outputs: {},
      status: 'failed',
      error: 'URL is required',
      timestamp: new Date().toISOString()
    });
  }

  const method = config.method || 'POST';

  return mockHttpCall(config).pipe(
    map((response): NodeRunResult => ({
      nodeId,
      outputs: {
        mock: true,
        request: {
          url: config.url,
          method: method,
          headers: config.headers,
          query: config.query,
          body: config.body,
          timeoutMs: config.timeoutMs
        },
        response,
        snapshot
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

