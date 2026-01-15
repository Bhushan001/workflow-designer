import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workflow-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Execution History</h1>
      <p>This page will display the execution history of all workflows.</p>
      <!-- TODO: Implement workflow execution history functionality -->
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
    h1 {
      margin-bottom: 20px;
    }
  `]
})
export class WorkflowHistoryComponent {}
