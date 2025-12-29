import { Component, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { WorkflowStateService } from '@core/services/workflow-state.service';
import { ExecutionEngineService } from '@core/services/execution-engine.service';
import {
  WorkflowNode,
  NodeType,
  TriggerNodeConfig,
  HttpNodeConfig,
  ConditionNodeConfig,
  DoNothingNodeConfig,
  CodeNodeConfig,
} from '@core/models/workflow.types';
import { CardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CardComponent,
  ],
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss',
})
export class PropertiesPanelComponent {
  selectedNode = computed(() => this.stateService.selectedNode());
  propertiesForm!: FormGroup;
  private formSubscription?: Subscription;
  private isUpdatingFromForm = false;
  private lastNodeId: string | null = null;
  isExecuting = false;
  
  faPlay = faPlay;
  faSpinner = faSpinner;

  constructor(
    private stateService: WorkflowStateService,
    private executionEngine: ExecutionEngineService,
    private fb: FormBuilder
  ) {
    effect(() => {
      const node = this.selectedNode();
      if (node) {
        // Only rebuild form if node ID changed (selection changed), not if node data changed
        if (node.id !== this.lastNodeId) {
          this.lastNodeId = node.id;
          this.buildForm(node);
        }
      } else {
        this.lastNodeId = null;
      }
    });
  }

  buildForm(node: WorkflowNode): void {
    const config = node.data.config;

    switch (node.type) {
      case 'TRIGGER':
        const triggerConfig = config as TriggerNodeConfig;
        this.propertiesForm = this.fb.group({
          label: [node.data.label, Validators.required],
          triggerType: [triggerConfig.triggerType || 'MANUAL', Validators.required],
          cron: [triggerConfig.cron || ''],
          webhookPath: [triggerConfig.webhookPath || ''],
        });
        break;
      case 'CIBIL':
      case 'CRIF':
      case 'EXPERIAN':
      case 'EQUIFIX':
        const httpConfig = config as HttpNodeConfig;
        // Parse headers, query, and body from config
        const headersJson = httpConfig.headers ? JSON.stringify(httpConfig.headers, null, 2) : '{}';
        const queryJson = httpConfig.query ? JSON.stringify(httpConfig.query, null, 2) : '{}';
        const bodyJson = httpConfig.body ? JSON.stringify(httpConfig.body, null, 2) : '{}';
        
        this.propertiesForm = this.fb.group({
          label: [node.data.label, Validators.required],
          url: [httpConfig.url || '', Validators.required],
          method: [httpConfig.method || 'POST', Validators.required],
          headers: [headersJson], // Removed required validator to allow editing
          query: [queryJson],
          body: [bodyJson], // No validators - allow free-form JSON editing
          timeoutMs: [httpConfig.timeoutMs || 30000, [Validators.required, Validators.min(1000)]],
        });
        break;
      case 'CONDITION':
        const conditionConfig = config as ConditionNodeConfig;
        this.propertiesForm = this.fb.group({
          label: [node.data.label, Validators.required],
          expression: [conditionConfig.expression || 'true', Validators.required],
        });
        break;
      case 'DO_NOTHING':
        const doNothingConfig = config as DoNothingNodeConfig;
        this.propertiesForm = this.fb.group({
          label: [node.data.label, Validators.required],
          note: [doNothingConfig.note || ''],
        });
        break;
      case 'CODE':
        const codeConfig = config as CodeNodeConfig;
        this.propertiesForm = this.fb.group({
          label: [node.data.label, Validators.required],
          code: [codeConfig.code || '// Your code here', Validators.required],
          timeoutMs: [codeConfig.timeoutMs || 1000],
        });
        break;
    }

    // Unsubscribe from previous form if it exists
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }

    // Subscribe to form changes
    this.formSubscription = this.propertiesForm.valueChanges.subscribe((values) => {
      this.updateNode(values);
    });
  }

  updateNode(values: any): void {
    const node = this.selectedNode();
    if (!node) return;
    
    // Prevent infinite loop: don't update if we're already updating from form
    if (this.isUpdatingFromForm) return;
    
    // Allow updates even if JSON fields are temporarily invalid during editing
    // Only check required fields (url, method, timeoutMs) for HTTP nodes
    if (node.type === 'CIBIL' || node.type === 'CRIF' || node.type === 'EXPERIAN' || node.type === 'EQUIFIX') {
      const requiredFieldsValid = 
        this.propertiesForm.get('url')?.valid &&
        this.propertiesForm.get('method')?.valid &&
        this.propertiesForm.get('timeoutMs')?.valid;
      
      if (!requiredFieldsValid) return;
    } else {
      // For other node types, check if form is valid
      if (!this.propertiesForm.valid) return;
    }

    this.isUpdatingFromForm = true;

    let updatedConfig: any = { ...node.data.config };
    
    // Parse JSON strings for HTTP nodes
    if (node.type === 'CIBIL' || node.type === 'CRIF' || node.type === 'EXPERIAN' || node.type === 'EQUIFIX') {
      updatedConfig.url = values.url;
      updatedConfig.method = values.method || 'POST';
      updatedConfig.timeoutMs = values.timeoutMs;
      
      // Parse JSON strings
      try {
        updatedConfig.headers = values.headers ? JSON.parse(values.headers) : {};
      } catch {
        updatedConfig.headers = {};
      }
      try {
        updatedConfig.query = values.query ? JSON.parse(values.query) : {};
      } catch {
        updatedConfig.query = {};
      }
      try {
        updatedConfig.body = values.body ? JSON.parse(values.body) : {};
      } catch {
        updatedConfig.body = {};
      }
    } else {
      // For other node types, use values directly
      updatedConfig = { ...updatedConfig, ...values };
    }

    const updatedNode: WorkflowNode = {
      ...node,
      data: {
        ...node.data,
        label: values.label,
        config: updatedConfig,
      },
    };

    this.stateService.updateNode(updatedNode);
    
    // Reset flag after a short delay to allow state to update
    setTimeout(() => {
      this.isUpdatingFromForm = false;
    }, 0);
  }

  isJsonInvalid(fieldName: string): boolean {
    const control = this.propertiesForm.get(fieldName);
    if (!control || !control.value || control.value.trim() === '') return false;
    
    try {
      JSON.parse(control.value);
      return false;
    } catch {
      return true;
    }
  }

  executeNode(): void {
    const node = this.selectedNode();
    if (!node || this.isExecuting) return;

    // First, update the node with current form values to ensure we test the latest config
    const values = this.propertiesForm.value;
    this.updateNode(values);

    // Get the updated node from state
    const updatedNode = this.stateService.nodes().find(n => n.id === node.id);
    if (!updatedNode) return;

    this.isExecuting = true;
    
    this.executionEngine.executeSingleNode(updatedNode).subscribe({
      next: (result) => {
        // Add result to state service's execution results
        const currentResults = this.stateService.executionResults();
        const existingIndex = currentResults.findIndex(r => r.nodeId === result.nodeId);
        
        if (existingIndex >= 0) {
          // Update existing result
          const updatedResults = [...currentResults];
          updatedResults[existingIndex] = result;
          this.stateService.executionResults.set(updatedResults);
        } else {
          // Add new result
          this.stateService.executionResults.set([...currentResults, result]);
        }
        
        this.isExecuting = false;
      },
      error: (error) => {
        console.error('Node execution failed:', error);
        // Add failed result
        const result = {
          nodeId: updatedNode.id,
          outputs: {},
          status: 'failed' as const,
          error: String(error),
          timestamp: new Date().toISOString()
        };
        
        const currentResults = this.stateService.executionResults();
        const existingIndex = currentResults.findIndex(r => r.nodeId === result.nodeId);
        
        if (existingIndex >= 0) {
          const updatedResults = [...currentResults];
          updatedResults[existingIndex] = result;
          this.stateService.executionResults.set(updatedResults);
        } else {
          this.stateService.executionResults.set([...currentResults, result]);
        }
        
        this.isExecuting = false;
      }
    });
  }
}
