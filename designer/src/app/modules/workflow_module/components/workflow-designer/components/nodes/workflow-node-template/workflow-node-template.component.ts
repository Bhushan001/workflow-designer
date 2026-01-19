import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBolt,
  faGlobe,
  faCodeBranch,
  faCircle,
  faCode,
  faClock,
  faEye,
  faDatabase,
  faPaperPlane,
  faFolder,
  faExchangeAlt,
  faHourglassHalf,
  faBox,
  faFileAlt,
  faShareNodes,
  faServer,
  faSignsPost,
  faSyncAlt,
  faObjectGroup,
  faList,
  faTextWidth,
  faCheckSquare,
  faPlug,
  faHashtag,
  faExclamationTriangle,
  faCalculator,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import {
  faSlack,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { NodeType, WorkflowNode } from '@shared/models/workflow.types';

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
      // Triggers
      TRIGGER: faBolt,
      WEBHOOK_TRIGGER: faPlug,
      SCHEDULE_TRIGGER: faClock,
      EMAIL_TRIGGER: faPaperPlane,
      FILE_WATCHER_TRIGGER: faEye,
      // Actions
      HTTP_REQUEST: faGlobe,
      DATABASE_QUERY: faDatabase,
      EMAIL_SEND: faPaperPlane,
      FILE_OPERATION: faFolder,
      TRANSFORM: faExchangeAlt,
      WAIT: faHourglassHalf,
      SET_VARIABLE: faBox,
      LOG: faFileAlt,
      NOTIFICATION: faBell,
      WEBHOOK_CALL: faShareNodes,
      SFTP: faServer,
      DO_NOTHING: faCircle,
      // Logic
      CONDITION: faCodeBranch,
      SWITCH: faSignsPost,
      LOOP: faSyncAlt,
      MERGE: faObjectGroup,
      // Data/Transform
      JSON_PARSE: faCode,
      JSON_STRINGIFY: faCode,
      ARRAY_OPERATION: faList,
      STRING_OPERATION: faTextWidth,
      VALIDATE: faCheckSquare,
      // Integrations
      API_INTEGRATION: faPlug,
      SLACK: faSlack,
      GITHUB: faGithub,
      CUSTOM_INTEGRATION: faHashtag,
      // Utilities
      ERROR_HANDLER: faExclamationTriangle,
      FUNCTION: faCalculator,
      // Code
      CODE: faCode,
    };
    return iconMap[this.node.type] || faGlobe;
  }

  // Removed getNodeColorClass and getBorderClass as styling is now handled via CSS classes
}

