import { Component, computed, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { WorkflowStateService } from '@core/services/workflow-state.service';
import { CardComponent } from '@shared/components/card/card.component';
import { PropertiesPanelComponent } from '../../properties/properties-panel/properties-panel.component';
import { JsonViewerComponent } from '@shared/components/json-viewer/json-viewer.component';

@Component({
  selector: 'app-node-editor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CardComponent, PropertiesPanelComponent, JsonViewerComponent],
  templateUrl: './node-editor.component.html',
  styleUrl: './node-editor.component.scss',
})
export class NodeEditorComponent {
  faTimes = faTimes;
  
  selectedNode = computed(() => this.stateService.selectedNode());
  executionResults = computed(() => this.stateService.executionResults());
  isOpen = computed(() => this.stateService.isNodeEditorOpen());

  // Column widths as percentages (default: 33.33% each)
  leftColumnWidth = signal(33.33);
  middleColumnWidth = signal(33.33);
  rightColumnWidth = signal(33.34); // Slightly more to account for rounding

  // Resize state
  isResizing = false;
  resizeHandle: 'left' | 'right' | null = null;
  startX = 0;
  startLeftWidth = 0;
  startMiddleWidth = 0;
  startRightWidth = 0;

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

  onResizeStart(handle: 'left' | 'right', event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;
    this.resizeHandle = handle;
    this.startX = event.clientX;
    this.startLeftWidth = this.leftColumnWidth();
    this.startMiddleWidth = this.middleColumnWidth();
    this.startRightWidth = this.rightColumnWidth();
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isResizing || !this.resizeHandle) return;

    const container = document.querySelector('.node-editor .flex-grow-1') as HTMLElement;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const deltaX = event.clientX - this.startX;
    const deltaPercent = (deltaX / containerWidth) * 100;

    if (this.resizeHandle === 'left') {
      // Resizing between left and middle columns
      const newLeftWidth = Math.max(10, Math.min(60, this.startLeftWidth + deltaPercent));
      const newMiddleWidth = Math.max(10, Math.min(60, this.startMiddleWidth - deltaPercent));
      const newRightWidth = 100 - newLeftWidth - newMiddleWidth;

      if (newRightWidth >= 10) {
        this.leftColumnWidth.set(newLeftWidth);
        this.middleColumnWidth.set(newMiddleWidth);
        this.rightColumnWidth.set(newRightWidth);
      }
    } else if (this.resizeHandle === 'right') {
      // Resizing between middle and right columns
      const newMiddleWidth = Math.max(10, Math.min(60, this.startMiddleWidth + deltaPercent));
      const newRightWidth = Math.max(10, Math.min(60, this.startRightWidth - deltaPercent));
      const newLeftWidth = 100 - newMiddleWidth - newRightWidth;

      if (newLeftWidth >= 10) {
        this.middleColumnWidth.set(newMiddleWidth);
        this.rightColumnWidth.set(newRightWidth);
        this.leftColumnWidth.set(newLeftWidth);
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.isResizing) {
      this.isResizing = false;
      this.resizeHandle = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }
}
