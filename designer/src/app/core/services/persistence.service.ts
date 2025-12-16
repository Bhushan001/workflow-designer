import { Injectable } from '@angular/core';
import { WorkflowDefinition } from '../models/workflow.types';

const STORAGE_KEY = 'workflow-designer-workflows';
const CURRENT_WORKFLOW_KEY = 'workflow-designer-current';

/**
 * Service for persisting workflows to localStorage.
 * Handles serialization, deserialization, and error handling.
 */
@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  /**
   * Save a workflow to localStorage.
   * @param workflow The workflow to save
   * @returns true if successful, false otherwise
   */
  saveWorkflow(workflow: WorkflowDefinition): boolean {
    try {
      const workflows = this.getAllWorkflows();
      const existingIndex = workflows.findIndex((w) => w.id === workflow.id);

      const updatedWorkflow: WorkflowDefinition = {
        ...workflow,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        workflows[existingIndex] = updatedWorkflow;
      } else {
        workflows.push(updatedWorkflow);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
      return true;
    } catch (error) {
      console.error('Failed to save workflow:', error);
      return false;
    }
  }

  /**
   * Load a workflow by ID from localStorage.
   * @param id The workflow ID
   * @returns The workflow if found, null otherwise
   */
  loadWorkflow(id: string): WorkflowDefinition | null {
    try {
      const workflows = this.getAllWorkflows();
      return workflows.find((w) => w.id === id) ?? null;
    } catch (error) {
      console.error('Failed to load workflow:', error);
      return null;
    }
  }

  /**
   * Get all saved workflows from localStorage.
   * @returns Array of all saved workflows
   */
  getAllWorkflows(): WorkflowDefinition[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as WorkflowDefinition[];
    } catch (error) {
      console.error('Failed to parse workflows from localStorage:', error);
      return [];
    }
  }

  /**
   * Delete a workflow from localStorage.
   * @param id The workflow ID to delete
   * @returns true if successful, false otherwise
   */
  deleteWorkflow(id: string): boolean {
    try {
      const workflows = this.getAllWorkflows();
      const filtered = workflows.filter((w) => w.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      return false;
    }
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

