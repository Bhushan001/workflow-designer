import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { WorkflowDefinition } from '@shared/models/workflow.types';
import { ApiResponse } from '@shared/models/auth.types';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  clientId?: string;
  workflowDefinition: WorkflowDefinition;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface WorkflowsPageResponse {
  content: Workflow[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class WorkflowApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Create a new workflow
   */
  createWorkflow(workflow: Partial<Workflow>): Observable<ApiResponse<Workflow>> {
    return this.http.post<ApiResponse<Workflow>>(
      `${this.apiUrl}/workflows`, 
      workflow
    );
  }

  /**
   * Get workflow by ID
   */
  getWorkflowById(id: string): Observable<ApiResponse<Workflow>> {
    return this.http.get<ApiResponse<Workflow>>(
      `${this.apiUrl}/workflows/${id}`
    );
  }

  /**
   * Get all workflows with pagination
   */
  getWorkflows(page: number = 0, size: number = 10, search?: string): Observable<ApiResponse<WorkflowsPageResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<WorkflowsPageResponse>>(
      `${this.apiUrl}/workflows`, 
      { params }
    );
  }

  /**
   * Update workflow
   */
  updateWorkflow(id: string, workflow: Partial<Workflow>): Observable<ApiResponse<Workflow>> {
    return this.http.put<ApiResponse<Workflow>>(
      `${this.apiUrl}/workflows/${id}`, 
      workflow
    );
  }

  /**
   * Delete workflow
   */
  deleteWorkflow(id: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/workflows/${id}`
    );
  }

  /**
   * Save workflow (create or update)
   * If workflowId is provided, tries to update first. If update fails with 404, creates new workflow.
   */
  saveWorkflow(workflowDefinition: WorkflowDefinition, workflowId?: string, name?: string, description?: string, clientId?: string): Observable<Workflow> {
    const workflowPayload: Partial<Workflow> = {
      name: name || workflowDefinition.name,
      description: description,
      workflowDefinition: workflowDefinition,
      status: 'DRAFT',
    };

    if (clientId) {
      workflowPayload.clientId = clientId;
    }

    // If workflowId is provided, try to update first
    if (workflowId) {
      return this.updateWorkflow(workflowId, workflowPayload).pipe(
        map((response) => response.body),
        catchError((error) => {
          // If update fails with 404 (workflow not found), create new workflow instead
          if (error.status === 404 || (error.error && (error.error.statusCode === 400 || error.error.message?.includes('not found')))) {
            console.log('Workflow not found, creating new workflow instead');
            return this.createWorkflow(workflowPayload).pipe(
              map((response) => response.body)
            );
          }
          // Re-throw other errors
          throw error;
        })
      );
    } else {
      // Create new workflow
      return this.createWorkflow(workflowPayload).pipe(
        map((response) => response.body)
      );
    }
  }
}
