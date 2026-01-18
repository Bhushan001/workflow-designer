import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersistenceService } from './persistence.service';
import { WorkflowApiService } from './workflow-api.service';
import { WorkflowDefinition } from '@shared/models/workflow.types';

export interface Workflow {
  id: string;
  name: string;
  nodes?: any[];
  edges?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkflowsPageResponse {
  content: Workflow[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private persistenceService = inject(PersistenceService);
  private workflowApiService = inject(WorkflowApiService);

  /**
   * Get paginated workflows with search
   * Uses backend API directly with server-side pagination
   */
  getWorkflows(page: number = 0, size: number = 10, search?: string): Observable<WorkflowsPageResponse> {
    // Use WorkflowApiService directly to get paginated response from backend
    return this.workflowApiService.getWorkflows(page, size, search).pipe(
      map((response) => {
        let pageResponse: any = null;
        
        // Handle response format: { data: { content: [...], totalElements, ... }, message, statusCode }
        if (response && typeof response === 'object' && 'data' in response) {
          pageResponse = (response as { data: any }).data;
        } else if (response && typeof response === 'object' && 'body' in response && response.body && typeof response.body === 'object') {
          const body = response.body as any;
          if ('data' in body) {
            pageResponse = body.data;
          } else {
            pageResponse = body;
          }
        } else if (response && typeof response === 'object') {
          pageResponse = response;
        }
        
        if (pageResponse && pageResponse.content) {
          // Convert backend Workflow format to frontend Workflow format
          const workflows: Workflow[] = pageResponse.content.map((w: any) => {
            let workflowDef: WorkflowDefinition | null = null;
            
            // Parse workflowDefinition if it's a JSON string
            if (w.workflowDefinition) {
              if (typeof w.workflowDefinition === 'string') {
                try {
                  workflowDef = JSON.parse(w.workflowDefinition) as WorkflowDefinition;
                } catch (e) {
                  console.error('Failed to parse workflowDefinition:', e);
                  workflowDef = null;
                }
              } else {
                workflowDef = w.workflowDefinition as WorkflowDefinition;
              }
            }
            
            return {
              id: w.id,
              name: w.name || 'Untitled Workflow',
              nodes: workflowDef?.nodes || [],
              edges: workflowDef?.edges || [],
              createdAt: w.createdAt || workflowDef?.createdAt,
              updatedAt: w.updatedAt || workflowDef?.updatedAt
            };
          });
          
          return {
            content: workflows,
            totalElements: pageResponse.totalElements || 0,
            totalPages: pageResponse.totalPages || 0,
            size: pageResponse.size || size,
            number: pageResponse.number || page,
            first: pageResponse.first !== undefined ? pageResponse.first : page === 0,
            last: pageResponse.last !== undefined ? pageResponse.last : false
          };
        }
        
        // Fallback: empty response
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size,
          number: page,
          first: true,
          last: true
        };
      })
    );
  }

  /**
   * Delete a workflow
   */
  deleteWorkflow(id: string): Observable<boolean> {
    return this.persistenceService.deleteWorkflow(id);
  }

  /**
   * Get a single workflow by ID
   */
  getWorkflowById(id: string): Observable<WorkflowDefinition | null> {
    return this.persistenceService.loadWorkflow(id);
  }
}
