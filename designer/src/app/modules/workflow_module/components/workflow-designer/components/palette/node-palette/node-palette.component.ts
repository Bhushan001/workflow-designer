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
  // New icons for additional nodes
  faClock,
  faEye,
  faDatabase,
  faPaperPlane,
  faFolder,
  faExchangeAlt,
  faHourglassHalf,
  faBox,
  faFileAlt,
  faPlug,
  faServer,
  faHashtag,
  faSignsPost,
  faSyncAlt,
  faObjectGroup,
  faList,
  faTextWidth,
  faCheckSquare,
  faExclamationTriangle,
  faCalculator,
  faShareNodes,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import {
  faSlack,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
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
  // New icons
  faClock = faClock;
  faEye = faEye;
  faDatabase = faDatabase;
  faPaperPlane = faPaperPlane;
  faFolder = faFolder;
  faExchangeAlt = faExchangeAlt;
  faHourglassHalf = faHourglassHalf;
  faBox = faBox;
  faFileAlt = faFileAlt;
  faPlug = faPlug;
  faServer = faServer;
  faHashtag = faHashtag;
  faSignsPost = faSignsPost;
  faSyncAlt = faSyncAlt;
  faObjectGroup = faObjectGroup;
  faList = faList;
  faTextWidth = faTextWidth;
  faCheckSquare = faCheckSquare;
  faSlack = faSlack;
  faGithub = faGithub;
  faExclamationTriangle = faExclamationTriangle;
  faCalculator = faCalculator;
  faShareNodes = faShareNodes;
  faBell = faBell;

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
        { 
          type: 'WEBHOOK_TRIGGER', 
          icon: faPlug, 
          label: 'Webhook Trigger', 
          colorClass: 'text-warning',
          description: 'Trigger workflow via HTTP webhook'
        },
        { 
          type: 'SCHEDULE_TRIGGER', 
          icon: faClock, 
          label: 'Schedule Trigger', 
          colorClass: 'text-warning',
          description: 'Trigger workflow on a schedule (cron)'
        },
        { 
          type: 'EMAIL_TRIGGER', 
          icon: faPaperPlane, 
          label: 'Email Trigger', 
          colorClass: 'text-warning',
          description: 'Trigger workflow when email is received'
        },
        { 
          type: 'FILE_WATCHER_TRIGGER', 
          icon: faEye, 
          label: 'File Watcher Trigger', 
          colorClass: 'text-warning',
          description: 'Trigger workflow when files are created, modified, or deleted'
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
          type: 'DATABASE_QUERY', 
          icon: faDatabase, 
          label: 'Database Query', 
          colorClass: 'text-primary',
          description: 'Execute database queries'
        },
        { 
          type: 'EMAIL_SEND', 
          icon: faPaperPlane, 
          label: 'Send Email', 
          colorClass: 'text-primary',
          description: 'Send emails with attachments'
        },
        { 
          type: 'FILE_OPERATION', 
          icon: faFolder, 
          label: 'File Operation', 
          colorClass: 'text-primary',
          description: 'Read, write, copy, move, or delete files'
        },
        { 
          type: 'TRANSFORM', 
          icon: faExchangeAlt, 
          label: 'Transform', 
          colorClass: 'text-primary',
          description: 'Transform data using mapping rules'
        },
        { 
          type: 'WAIT', 
          icon: faHourglassHalf, 
          label: 'Wait', 
          colorClass: 'text-primary',
          description: 'Wait for a duration or until a specific time'
        },
        { 
          type: 'SET_VARIABLE', 
          icon: faBox, 
          label: 'Set Variable', 
          colorClass: 'text-primary',
          description: 'Set workflow or session variables'
        },
        { 
          type: 'LOG', 
          icon: faFileAlt, 
          label: 'Log', 
          colorClass: 'text-primary',
          description: 'Log messages at different levels'
        },
        { 
          type: 'NOTIFICATION', 
          icon: faBell, 
          label: 'Notification', 
          colorClass: 'text-primary',
          description: 'Send notifications via email, push, SMS, or Slack'
        },
        { 
          type: 'WEBHOOK_CALL', 
          icon: faShareNodes, 
          label: 'Webhook Call', 
          colorClass: 'text-primary',
          description: 'Call external webhooks'
        },
        { 
          type: 'SFTP', 
          icon: faServer, 
          label: 'SFTP', 
          colorClass: 'text-primary',
          description: 'Upload, download, list, or delete files via SFTP'
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
        { 
          type: 'SWITCH', 
          icon: faSignsPost, 
          label: 'Switch', 
          colorClass: 'text-info',
          description: 'Switch between multiple branches based on value'
        },
        { 
          type: 'LOOP', 
          icon: faSyncAlt, 
          label: 'Loop', 
          colorClass: 'text-info',
          description: 'Loop through array items'
        },
        { 
          type: 'MERGE', 
          icon: faObjectGroup, 
          label: 'Merge', 
          colorClass: 'text-info',
          description: 'Merge data from multiple branches'
        },
      ],
    },
    {
      id: 'data-transform',
      name: 'Data/Transform',
      icon: faCode,
      iconColor: '#8b5cf6',
      expanded: false,
      nodes: [
        { 
          type: 'JSON_PARSE', 
          icon: faCode, 
          label: 'JSON Parse', 
          colorClass: 'text-purple',
          description: 'Parse JSON string to object'
        },
        { 
          type: 'JSON_STRINGIFY', 
          icon: faCode, 
          label: 'JSON Stringify', 
          colorClass: 'text-purple',
          description: 'Convert object to JSON string'
        },
        { 
          type: 'ARRAY_OPERATION', 
          icon: faList, 
          label: 'Array Operation', 
          colorClass: 'text-purple',
          description: 'Filter, map, reduce, sort, find, or slice arrays'
        },
        { 
          type: 'STRING_OPERATION', 
          icon: faTextWidth, 
          label: 'String Operation', 
          colorClass: 'text-purple',
          description: 'Manipulate strings (concat, split, replace, etc.)'
        },
        { 
          type: 'VALIDATE', 
          icon: faCheckSquare, 
          label: 'Validate', 
          colorClass: 'text-purple',
          description: 'Validate data against schema or rules'
        },
      ],
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: faPlug,
      iconColor: '#ec4899',
      expanded: false,
      nodes: [
        { 
          type: 'API_INTEGRATION', 
          icon: faPlug, 
          label: 'API Integration', 
          colorClass: 'text-pink',
          description: 'Connect to external APIs using templates'
        },
        { 
          type: 'SLACK', 
          icon: faSlack, 
          label: 'Slack', 
          colorClass: 'text-pink',
          description: 'Send messages, create channels, or update messages in Slack'
        },
        { 
          type: 'GITHUB', 
          icon: faGithub, 
          label: 'GitHub', 
          colorClass: 'text-pink',
          description: 'Create issues, PRs, or manage GitHub repositories'
        },
        { 
          type: 'CUSTOM_INTEGRATION', 
          icon: faHashtag, 
          label: 'Custom Integration', 
          colorClass: 'text-pink',
          description: 'Custom integration with configurable settings'
        },
      ],
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: faCalculator,
      iconColor: '#14b8a6',
      expanded: false,
      nodes: [
        { 
          type: 'ERROR_HANDLER', 
          icon: faExclamationTriangle, 
          label: 'Error Handler', 
          colorClass: 'text-teal',
          description: 'Handle errors with retry, fallback, or abort actions'
        },
        { 
          type: 'FUNCTION', 
          icon: faCalculator, 
          label: 'Function', 
          colorClass: 'text-teal',
          description: 'Execute math, string, date, or custom functions'
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
