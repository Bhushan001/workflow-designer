import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBolt,
  faGlobe,
  faCodeBranch,
  faCircle,
  faCode,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { NodeType } from '@core/models/workflow.types';

interface NodeTypeInfo {
  type: NodeType;
  icon: any;
  label: string;
  colorClass: string;
}

@Component({
  selector: 'app-node-palette',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './node-palette.component.html',
  styleUrl: './node-palette.component.scss',
})
export class NodePaletteComponent {
  isCollapsed = signal(false);

  // Icons
  faBolt = faBolt;
  faGlobe = faGlobe;
  faCodeBranch = faCodeBranch;
  faCircle = faCircle;
  faCode = faCode;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  nodeTypes: NodeTypeInfo[] = [
    { type: 'TRIGGER', icon: faBolt, label: 'Trigger', colorClass: 'text-warning' },
    { type: 'CIBIL', icon: faGlobe, label: 'CIBIL', colorClass: 'text-primary' },
    { type: 'CRIF', icon: faGlobe, label: 'CRIF', colorClass: 'text-success' },
    { type: 'EXPERIAN', icon: faGlobe, label: 'EXPERIAN', colorClass: 'text-warning' },
    { type: 'EQUIFIX', icon: faGlobe, label: 'EQUIFIX', colorClass: 'text-info' },
    { type: 'CONDITION', icon: faCodeBranch, label: 'Condition', colorClass: 'text-info' },
    { type: 'DO_NOTHING', icon: faCircle, label: 'Do Nothing', colorClass: 'text-secondary' },
    { type: 'CODE', icon: faCode, label: 'Code', colorClass: 'text-danger' },
  ];

  @Output() addNode = new EventEmitter<NodeType>();

  onAddNode(type: NodeType): void {
    this.addNode.emit(type);
  }

  toggleCollapse(): void {
    this.isCollapsed.update((value) => !value);
  }
}
