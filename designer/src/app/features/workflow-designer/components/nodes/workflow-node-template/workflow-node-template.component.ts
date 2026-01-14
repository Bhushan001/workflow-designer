import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBolt,
  faGlobe,
  faCodeBranch,
  faCircle,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import { NodeType, WorkflowNode } from '@core/models/workflow.types';

@Component({
  selector: 'app-workflow-node-template',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './workflow-node-template.component.html',
  styleUrl: './workflow-node-template.component.scss',
})
export class WorkflowNodeTemplateComponent {
  @Input() node!: WorkflowNode;
  @Input() selected = false;

  // Icons
  faBolt = faBolt;
  faGlobe = faGlobe;
  faCodeBranch = faCodeBranch;
  faCircle = faCircle;
  faCode = faCode;

  getNodeIcon(): any {
    const iconMap: Record<NodeType, any> = {
      TRIGGER: faBolt,
      HTTP_REQUEST: faGlobe,
      CONDITION: faCodeBranch,
      DO_NOTHING: faCircle,
      CODE: faCode,
    };
    return iconMap[this.node.type] || faGlobe;
  }

  // Removed getNodeColorClass and getBorderClass as styling is now handled via CSS classes
}

