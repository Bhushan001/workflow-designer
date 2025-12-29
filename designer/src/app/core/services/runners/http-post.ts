import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, timeout } from 'rxjs';
import { HttpNodeConfig, ExecutionSnapshot, NodeRunResult } from '../../models/workflow.types';

@Injectable({ providedIn: 'root' })
export class HttpNodeRunner {
  constructor(private http: HttpClient) {}

  runHttpNode(
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
    const timeoutMs = config.timeoutMs || 30000;

    // Build headers
    let headers = new HttpHeaders();
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]: [string, string]) => {
        headers = headers.set(key, value);
      });
    }
    // Set default Content-Type if not provided
    if (!config.headers?.['Content-Type'] && !config.headers?.['content-type']) {
      headers = headers.set('Content-Type', 'application/json');
    }

    // Build query parameters
    let params = new HttpParams();
    if (config.query) {
      Object.entries(config.query).forEach(([key, value]: [string, string]) => {
        params = params.set(key, String(value));
      });
    }

    // Build request options
    const options: {
      headers?: HttpHeaders;
      params?: HttpParams;
      observe: 'response';
    } = {
      headers,
      params,
      observe: 'response' as const
    };

    // Make the HTTP request based on method
    let request$: Observable<any>;
    switch (method.toUpperCase()) {
      case 'GET':
        request$ = this.http.get(config.url, options);
        break;
      case 'POST':
        request$ = this.http.post(config.url, config.body || {}, options);
        break;
      case 'PUT':
        request$ = this.http.put(config.url, config.body || {}, options);
        break;
      case 'PATCH':
        request$ = this.http.patch(config.url, config.body || {}, options);
        break;
      case 'DELETE':
        request$ = this.http.delete(config.url, options);
        break;
      default:
        return of({
          nodeId,
          outputs: {},
          status: 'failed',
          error: `Unsupported HTTP method: ${method}`,
          timestamp: new Date().toISOString()
        });
    }

    return request$.pipe(
      timeout(timeoutMs),
      map((response): NodeRunResult => {
        // Extract response data
        const responseBody = response.body;
        const responseHeaders: Record<string, string> = {};
        response.headers.keys().forEach((key: string) => {
          responseHeaders[key] = response.headers.get(key) || '';
        });

        return {
          nodeId,
          outputs: {
            request: {
              url: config.url,
              method: method,
              headers: config.headers || {},
              query: config.query || {},
              body: config.body,
              timeoutMs: timeoutMs
            },
            response: {
              status: response.status,
              statusText: response.statusText,
              data: responseBody,
              headers: responseHeaders
            },
            snapshot
          },
          status: 'success',
          timestamp: new Date().toISOString()
        };
      }),
      catchError((error: HttpErrorResponse | Error): Observable<NodeRunResult> => {
        let errorMessage = 'Unknown error';
        let statusCode = 0;
        let responseData: any = null;

        if (error instanceof HttpErrorResponse) {
          statusCode = error.status;
          responseData = error.error;
          errorMessage = error.message || `HTTP ${error.status}: ${error.statusText}`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = String(error);
        }

        return of({
          nodeId,
          outputs: {
            request: {
              url: config.url,
              method: method,
              headers: config.headers || {},
              query: config.query || {},
              body: config.body,
              timeoutMs: timeoutMs
            },
            response: {
              status: statusCode,
              statusText: errorMessage,
              data: responseData,
              error: errorMessage
            },
            snapshot
          },
          status: 'failed',
          error: errorMessage,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}

// Export a function wrapper for backward compatibility
export function runHttpNode(
  nodeId: string,
  config: HttpNodeConfig,
  snapshot: ExecutionSnapshot
): Observable<NodeRunResult> {
  // This will be injected by Angular's DI system
  // For now, we need to make this a service injection
  throw new Error('runHttpNode must be called through HttpNodeRunner service. Use ExecutionEngineService which should inject HttpNodeRunner.');
}

