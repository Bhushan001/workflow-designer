import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/workflow-designer/pages/workflow-designer/workflow-designer.component').then(
        (m) => m.WorkflowDesignerComponent
      ),
  },
];
