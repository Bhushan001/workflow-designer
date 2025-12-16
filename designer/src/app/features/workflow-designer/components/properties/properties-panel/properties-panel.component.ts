import { Component, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowStateService } from '@core/services/workflow-state.service';
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
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss',
})
export class PropertiesPanelComponent {
  selectedNode = computed(() => this.stateService.selectedNode());
  propertiesForm!: FormGroup;

  constructor(
    private stateService: WorkflowStateService,
    private fb: FormBuilder
  ) {
    effect(() => {
      const node = this.selectedNode();
      if (node) {
        this.buildForm(node);
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
          headers: [headersJson, Validators.required],
          query: [queryJson],
          body: [bodyJson],
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

    // Subscribe to form changes
    this.propertiesForm.valueChanges.subscribe((values) => {
      this.updateNode(values);
    });
  }

  updateNode(values: any): void {
    const node = this.selectedNode();
    if (!node || !this.propertiesForm.valid) return;

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
  }
}
