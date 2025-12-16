import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { WorkflowStateService } from '@core/services/workflow-state.service';
import { CardComponent } from '@shared/components/card/card.component';
import { PropertiesPanelComponent } from '../../properties/properties-panel/properties-panel.component';

@Component({
  selector: 'app-node-editor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CardComponent, PropertiesPanelComponent],
  templateUrl: './node-editor.component.html',
  styleUrl: './node-editor.component.scss',
})
export class NodeEditorComponent {
  faTimes = faTimes;
  
  selectedNode = computed(() => this.stateService.selectedNode());
  executionResults = computed(() => this.stateService.executionResults());
  isOpen = computed(() => this.stateService.isNodeEditorOpen());

  constructor(public stateService: WorkflowStateService) {}

  closeEditor(): void {
    this.stateService.closeNodeEditor();
  }

  getPreviousNodeResult(): any {
    const node = this.selectedNode();
    if (!node) return null;

    const edges = this.stateService.edges();
    const previousEdge = edges.find((e) => e.target === node.id);
    if (!previousEdge) return null;

    return this.executionResults().find((r) => r.nodeId === previousEdge.source);
  }

  getCurrentNodeResult(): any {
    const node = this.selectedNode();
    if (!node) return null;

    return this.executionResults().find((r) => r.nodeId === node.id);
  }
}
