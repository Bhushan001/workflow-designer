import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersistenceService } from './persistence.service';
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

  /**
   * Get paginated workflows with search
   * Since workflows are stored in localStorage, we do client-side pagination
   */
  getWorkflows(page: number = 0, size: number = 10, search?: string): Observable<WorkflowsPageResponse> {
    // Get all workflows from localStorage
    const allWorkflows = this.persistenceService.getAllWorkflows();
    
    // Convert WorkflowDefinition to Workflow format
    let workflows: Workflow[] = allWorkflows.map(w => ({
      id: w.id,
      name: w.name || 'Untitled Workflow',
      nodes: w.nodes,
      edges: w.edges,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt
    }));

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchLower = search.trim().toLowerCase();
      workflows = workflows.filter(w => 
        w.name.toLowerCase().includes(searchLower) ||
        w.id.toLowerCase().includes(searchLower)
      );
    }

    // Sort by updatedAt (most recent first) or createdAt
    workflows.sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt || '';
      const dateB = b.updatedAt || b.createdAt || '';
      return dateB.localeCompare(dateA);
    });

    // Calculate pagination
    const totalElements = workflows.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedWorkflows = workflows.slice(startIndex, endIndex);

    const response: WorkflowsPageResponse = {
      content: paginatedWorkflows,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1
    };

    return of(response);
  }

  /**
   * Delete a workflow
   */
  deleteWorkflow(id: string): Observable<boolean> {
    const success = this.persistenceService.deleteWorkflow(id);
    return of(success);
  }

  /**
   * Get a single workflow by ID
   */
  getWorkflowById(id: string): Observable<WorkflowDefinition | null> {
    const workflow = this.persistenceService.loadWorkflow(id);
    return of(workflow);
  }
}
