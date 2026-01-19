import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import {
  ExecutionResult,
  NodeRunResult,
  WorkflowEdge,
  WorkflowNode
} from '@shared/models/workflow.types';
import { environment } from '../../../../environments/environment';

interface ExecutionRequest {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

interface SingleNodeExecutionRequest {
  node: WorkflowNode;
}

@Injectable({ providedIn: 'root' })
export class ExecutionEngineService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Execute a complete workflow on the backend.
   */
  execute(nodes: WorkflowNode[], edges: WorkflowEdge[]): Observable<ExecutionResult> {
    const request: ExecutionRequest = { nodes, edges };
    
    interface WrappedResponse {
      statusCode: number;
      message: string;
      data: ExecutionResult;
    }
    
    return this.http.post<WrappedResponse>(`${this.apiUrl}/workflows/execute`, request).pipe(
      map((response) => {
        // Extract data from wrapped response
        if (response && 'data' in response) {
          return response.data;
        }
        // Fallback: if response is already an ExecutionResult (shouldn't happen but handle gracefully)
        return response as unknown as ExecutionResult;
      }),
      catchError((error) => {
        console.error('Workflow execution failed:', error);
        return throwError(() => new Error(
          error.error?.message || error.message || 'Workflow execution failed'
        ));
      })
    );
  }

  /**
   * Execute a single node for testing purposes on the backend.
   */
  executeSingleNode(node: WorkflowNode): Observable<NodeRunResult> {
    const request: SingleNodeExecutionRequest = { node };
    
    interface WrappedResponse {
      statusCode: number;
      message: string;
      data: NodeRunResult;
    }
    
    return this.http.post<WrappedResponse>(`${this.apiUrl}/workflows/execute/node`, request).pipe(
      map((response) => {
        // Extract data from wrapped response
        if (response && 'data' in response) {
          return response.data;
        }
        // Fallback: if response is already a NodeRunResult (shouldn't happen but handle gracefully)
        return response as unknown as NodeRunResult;
      }),
      catchError((error) => {
        console.error('Node execution failed:', error);
        return throwError(() => new Error(
          error.error?.message || error.message || 'Node execution failed'
        ));
      })
    );
  }
}
