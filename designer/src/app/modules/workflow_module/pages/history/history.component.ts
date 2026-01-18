import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface ExecutionHistory {
  id: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running';
  startedAt: string;
  completedAt?: string;
  duration?: string;
  nodesExecuted: number;
  totalNodes: number;
}

@Component({
  selector: 'app-workflow-history',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class WorkflowHistoryComponent implements OnInit {
  // Icons
  faClock = faClock;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;

  // Mock data
  executionHistory: ExecutionHistory[] = [
    {
      id: 'exec-001',
      workflowName: 'Data Processing Workflow',
      status: 'success',
      startedAt: '2026-01-18T10:30:00Z',
      completedAt: '2026-01-18T10:30:45Z',
      duration: '45s',
      nodesExecuted: 5,
      totalNodes: 5
    },
    {
      id: 'exec-002',
      workflowName: 'Email Notification Workflow',
      status: 'success',
      startedAt: '2026-01-18T09:15:00Z',
      completedAt: '2026-01-18T09:15:30Z',
      duration: '30s',
      nodesExecuted: 3,
      totalNodes: 3
    },
    {
      id: 'exec-003',
      workflowName: 'API Integration Workflow',
      status: 'failed',
      startedAt: '2026-01-18T08:00:00Z',
      completedAt: '2026-01-18T08:00:20Z',
      duration: '20s',
      nodesExecuted: 2,
      totalNodes: 4
    },
    {
      id: 'exec-004',
      workflowName: 'Data Processing Workflow',
      status: 'running',
      startedAt: '2026-01-18T11:00:00Z',
      nodesExecuted: 2,
      totalNodes: 5
    },
    {
      id: 'exec-005',
      workflowName: 'Report Generation Workflow',
      status: 'success',
      startedAt: '2026-01-17T16:45:00Z',
      completedAt: '2026-01-17T16:46:15Z',
      duration: '1m 15s',
      nodesExecuted: 8,
      totalNodes: 8
    }
  ];

  ngOnInit(): void {
    // Mock data is already initialized
  }

  getStatusIcon(status: string) {
    switch (status) {
      case 'success':
        return this.faCheckCircle;
      case 'failed':
        return this.faTimesCircle;
      case 'running':
        return this.faSpinner;
      default:
        return this.faClock;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'success':
        return 'status-success';
      case 'failed':
        return 'status-failed';
      case 'running':
        return 'status-running';
      default:
        return 'status-pending';
    }
  }
}
