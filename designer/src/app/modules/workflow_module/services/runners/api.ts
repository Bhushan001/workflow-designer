import { catchError, map, Observable, of } from 'rxjs';
import { ApiNodeConfig, ExecutionSnapshot, NodeRunResult } from '@shared/models/workflow.types';
import { mockApiCall } from '@shared/utils/mock/mock-api';

export function runApiNode(
  nodeId: string,
  config: ApiNodeConfig,
  snapshot: ExecutionSnapshot
): Observable<NodeRunResult> {
  if (!config.url || config.url.trim() === '') {
    return of({
      nodeId,
      outputs: {},
      status: 'failed',
      error: 'API URL is required',
      timestamp: new Date().toISOString()
    });
  }

  return mockApiCall(config).pipe(
    map((response): NodeRunResult => ({
      nodeId,
      outputs: {
        mock: true,
        request: {
          url: config.url,
          method: config.method,
          headers: config.headers,
          query: config.query,
          body: config.body
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

