import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workflow-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Workflow Settings</h1>
      <p>This page will contain user-specific workflow settings and preferences.</p>
      <!-- TODO: Implement workflow settings functionality -->
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
export class WorkflowSettingsComponent {}
