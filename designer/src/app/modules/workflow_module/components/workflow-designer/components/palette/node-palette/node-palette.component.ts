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
  faChevronDown,
  faChevronUp,
  faPlay,
  faNetworkWired,
  faShapes,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import { NodeType } from '@shared/models/workflow.types';

interface NodeTypeInfo {
  type: NodeType;
  icon: any;
  label: string;
  colorClass: string;
  description?: string;
}

interface NodeCategory {
  id: string;
  name: string;
  icon: any;
  iconColor: string;
  nodes: NodeTypeInfo[];
  expanded: boolean;
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
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faPlay = faPlay;
  faNetworkWired = faNetworkWired;
  faShapes = faShapes;
  faTerminal = faTerminal;

  // Node categories with accordion functionality
  categories: NodeCategory[] = [
    {
      id: 'triggers',
      name: 'Triggers',
      icon: faBolt,
      iconColor: '#f59e0b',
      expanded: true,
      nodes: [
        { 
          type: 'TRIGGER', 
          icon: faBolt, 
          label: 'Trigger', 
          colorClass: 'text-warning',
          description: 'Start your workflow manually, on a schedule, or via webhook'
        },
      ],
    },
    {
      id: 'actions',
      name: 'Actions',
      icon: faNetworkWired,
      iconColor: '#1e40af',
      expanded: true,
      nodes: [
        { 
          type: 'HTTP_REQUEST', 
          icon: faGlobe, 
          label: 'HTTP Request', 
          colorClass: 'text-primary',
          description: 'Make HTTP requests to external APIs'
        },
        { 
          type: 'DO_NOTHING', 
          icon: faCircle, 
          label: 'Do Nothing', 
          colorClass: 'text-secondary',
          description: 'A no-op node for testing or placeholders'
        },
      ],
    },
    {
      id: 'logic',
      name: 'Logic',
      icon: faShapes,
      iconColor: '#0ea5e9',
      expanded: false,
      nodes: [
        { 
          type: 'CONDITION', 
          icon: faCodeBranch, 
          label: 'Condition', 
          colorClass: 'text-info',
          description: 'Branch workflow based on conditions'
        },
      ],
    },
    {
      id: 'code',
      name: 'Code',
      icon: faTerminal,
      iconColor: '#10b981',
      expanded: false,
      nodes: [
        { 
          type: 'CODE', 
          icon: faCode, 
          label: 'Code', 
          colorClass: 'text-danger',
          description: 'Execute custom JavaScript code'
        },
      ],
    },
  ];

  @Output() addNode = new EventEmitter<NodeType>();

  onAddNode(type: NodeType): void {
    this.addNode.emit(type);
  }

  toggleCollapse(): void {
    this.isCollapsed.update((value) => !value);
  }

  toggleCategory(categoryId: string): void {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (category) {
      category.expanded = !category.expanded;
    }
  }

  expandAll(): void {
    this.categories.forEach(cat => cat.expanded = true);
  }

  collapseAll(): void {
    this.categories.forEach(cat => cat.expanded = false);
  }
}
