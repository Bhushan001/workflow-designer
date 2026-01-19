import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import {
  ExecutionResult,
  NodeRunResult,
  WorkflowEdge,
  WorkflowNode
} from '@shared/models/workflow.types';
import { ApiResponse } from '@shared/models/auth.types';
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
    
    return this.http.post<ApiResponse<ExecutionResult>>(`${this.apiUrl}/workflows/execute`, request).pipe(
      map((response) => response.body),
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
    
    return this.http.post<ApiResponse<NodeRunResult>>(`${this.apiUrl}/workflows/execute/node`, request).pipe(
      map((response) => response.body),
      catchError((error) => {
        console.error('Node execution failed:', error);
        return throwError(() => new Error(
          error.error?.message || error.message || 'Node execution failed'
        ));
      })
    );
  }
}
