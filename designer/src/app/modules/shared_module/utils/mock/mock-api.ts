import { Observable, of, delay, map } from 'rxjs';
import { HttpNodeConfig } from '../../models/workflow.types';

// Mock HTTP call returning an observable to align with an observable-based pipeline.
// Supports all HTTP methods: GET, POST, PUT, PATCH, DELETE
export function mockHttpCall(config: HttpNodeConfig): Observable<Record<string, unknown>> {
  const method = config.method || 'POST';
  const mockData: Record<string, unknown> = {
    GET: { success: true, value: 42, items: [1, 2, 3], timestamp: new Date().toISOString() },
    POST: { success: true, id: `mock-id-${Date.now()}`, created: true },
    PUT: { success: true, id: `mock-id-${Date.now()}`, updated: true },
    PATCH: { success: true, id: `mock-id-${Date.now()}`, patched: true },
    DELETE: { success: true, id: `mock-id-${Date.now()}`, deleted: true }
  };

  return of(null).pipe(
    delay(config.timeoutMs ? Math.min(config.timeoutMs, 100) : 100),
    map(() => {
      const methodData = mockData[method] || { success: true };
      return {
        status: 200,
        statusText: 'OK',
        message: `Mock HTTP ${method} response`,
        data: {
          ...methodData,
          timestamp: new Date().toISOString(),
          requestMethod: method,
          requestBody: config.body,
          requestHeaders: config.headers,
          queryParams: config.query
        },
        headers: {
          'content-type': 'application/json',
          'x-mock': 'true'
        }
      };
    })
  );
}

