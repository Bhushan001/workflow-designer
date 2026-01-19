import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WorkflowDefinition } from '@shared/models/workflow.types';
import { WorkflowApiService, Workflow, WorkflowsPageResponse } from './workflow-api.service';

const CURRENT_WORKFLOW_KEY = 'workflow-designer-current';

/**
 * Service for persisting workflows to backend API.
 * Falls back to localStorage for current workflow (auto-save).
 */
@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private workflowApiService = inject(WorkflowApiService);
  /**
   * Save a workflow to backend API.
   * @param workflow The workflow definition to save
   * @param workflowId Optional workflow ID for updates
   * @param name Workflow name (required, must be unique)
   * @param description Optional workflow description
   * @param clientId Optional client ID
   * @returns Observable<Workflow | null> - saved workflow if successful, null otherwise
   */
  saveWorkflow(
    workflow: WorkflowDefinition,
    workflowId?: string,
    name?: string,
    description?: string,
    clientId?: string
  ): Observable<Workflow | null> {
    // Validate name is provided
    const workflowName = name || workflow.name;
    if (!workflowName || workflowName.trim().length === 0) {
      return of(null);
    }

    // Validate name is not just "New Workflow"
    if (workflowName.trim() === 'New Workflow') {
      return of(null);
    }

    return this.workflowApiService.saveWorkflow(workflow, workflowId, workflowName, description, clientId).pipe(
      map((savedWorkflow) => {
        if (savedWorkflow && savedWorkflow.id) {
          // Update workflow ID if it was a new workflow
          if (!workflowId && savedWorkflow.id) {
            workflow.id = savedWorkflow.id;
          }
          // Update workflow name if it changed
          if (savedWorkflow.name) {
            workflow.name = savedWorkflow.name;
          }
          // Save current workflow to localStorage for auto-restore
          this.saveCurrentWorkflow(workflow);
          return savedWorkflow;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Failed to save workflow:', error);
        return of(null);
      })
    );
  }

  /**
   * Load a workflow by ID from backend API.
   * @param id The workflow ID
   * @returns Observable<WorkflowDefinition | null>
   */
  loadWorkflow(id: string): Observable<WorkflowDefinition | null> {
    return this.workflowApiService.getWorkflowById(id).pipe(
      map((response) => {
        const workflow: Workflow = response.body;
        
        if (workflow && workflow.workflowDefinition) {
          // Parse workflowDefinition if it's a JSON string
          let workflowDefinition: WorkflowDefinition;
          if (typeof workflow.workflowDefinition === 'string') {
            try {
              workflowDefinition = JSON.parse(workflow.workflowDefinition) as WorkflowDefinition;
            } catch (e) {
              console.error('Failed to parse workflowDefinition:', e);
              return null;
            }
          } else {
            workflowDefinition = workflow.workflowDefinition as WorkflowDefinition;
          }
          
          // IMPORTANT: Override the ID with the database UUID
          // The workflowDefinition.id might be an old temporary ID
          // We must use the database UUID (workflow.id) for updates
          if (workflow.id) {
            workflowDefinition.id = workflow.id;
          }
          // Also update name if it's different
          if (workflow.name) {
            workflowDefinition.name = workflow.name;
          }
          
          return workflowDefinition;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Failed to load workflow:', error);
        return of(null);
      })
    );
  }

  /**
   * Get all saved workflows from backend API.
   * @param page Page number (0-indexed)
   * @param size Page size
   * @param search Optional search term
   * @returns Observable<WorkflowDefinition[]>
   */
  getAllWorkflows(page: number = 0, size: number = 100, search?: string): Observable<WorkflowDefinition[]> {
    return this.workflowApiService.getWorkflows(page, size, search).pipe(
      map((response) => {
        const pageResponse: WorkflowsPageResponse = response.body;
        
        if (pageResponse && pageResponse.content) {
          return pageResponse.content
            .map((w: Workflow) => {
              // Parse workflowDefinition if it's a JSON string
              if (w.workflowDefinition) {
                if (typeof w.workflowDefinition === 'string') {
                  try {
                    return JSON.parse(w.workflowDefinition) as WorkflowDefinition;
                  } catch (e) {
                    console.error('Failed to parse workflowDefinition:', e);
                    return null;
                  }
                } else {
                  return w.workflowDefinition as WorkflowDefinition;
                }
              }
              return null;
            })
            .filter((w: WorkflowDefinition | null | undefined): w is WorkflowDefinition => w !== null && w !== undefined);
        }
        return [];
      }),
      catchError((error) => {
        console.error('Failed to get workflows:', error);
        return of([]);
      })
    );
  }

  /**
   * Delete a workflow from backend API.
   * @param id The workflow ID to delete
   * @returns Observable<boolean> - true if successful
   */
  deleteWorkflow(id: string): Observable<boolean> {
    return this.workflowApiService.deleteWorkflow(id).pipe(
      map((response) => {
        // Check if response indicates success
        if ('statusCode' in response) {
          return response.statusCode === 200 || response.statusCode === 204;
        }
        return true; // Assume success if no status code
      }),
      catchError((error) => {
        console.error('Failed to delete workflow:', error);
        return of(false);
      })
    );
  }

  /**
   * Save the current workflow state (for auto-save).
   * @param workflow The current workflow
   */
  saveCurrentWorkflow(workflow: WorkflowDefinition): void {
    try {
      localStorage.setItem(CURRENT_WORKFLOW_KEY, JSON.stringify(workflow));
    } catch (error) {
      console.error('Failed to save current workflow:', error);
    }
  }

  /**
   * Load the last saved current workflow (for auto-restore).
   * @returns The workflow if found, null otherwise
   */
  loadCurrentWorkflow(): WorkflowDefinition | null {
    try {
      const stored = localStorage.getItem(CURRENT_WORKFLOW_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as WorkflowDefinition;
    } catch (error) {
      console.error('Failed to load current workflow:', error);
      return null;
    }
  }

  /**
   * Clear the current workflow from localStorage.
   */
  clearCurrentWorkflow(): void {
    try {
      localStorage.removeItem(CURRENT_WORKFLOW_KEY);
    } catch (error) {
      console.error('Failed to clear current workflow:', error);
    }
  }

  /**
   * Export workflow as JSON string.
   * @param workflow The workflow to export
   * @returns JSON string representation
   */
  exportWorkflowAsJson(workflow: WorkflowDefinition): string {
    return JSON.stringify(workflow, null, 2);
  }

  /**
   * Import workflow from JSON string.
   * @param json The JSON string to parse
   * @returns The parsed workflow or null if invalid
   */
  importWorkflowFromJson(json: string): WorkflowDefinition | null {
    try {
      const parsed = JSON.parse(json) as WorkflowDefinition;
      // Basic validation
      if (
        parsed.id &&
        parsed.name &&
        Array.isArray(parsed.nodes) &&
        Array.isArray(parsed.edges)
      ) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Failed to import workflow from JSON:', error);
      return null;
    }
  }
}

