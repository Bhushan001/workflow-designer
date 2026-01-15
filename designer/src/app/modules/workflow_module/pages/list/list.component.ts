import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <h1>My Workflows</h1>
      <p>This page will display all workflows for the current user.</p>
      <button class="btn btn-primary" routerLink="/designer">Create New Workflow</button>
      <!-- TODO: Implement workflow list functionality -->
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
    h1 {
      margin-bottom: 20px;
    }
    .btn {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
  `]
})
export class WorkflowListComponent {}
