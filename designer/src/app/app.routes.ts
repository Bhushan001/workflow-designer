import { Routes } from '@angular/router';
import { authGuard } from './modules/shared_module/guards/auth.guard';
import { roleGuard } from './modules/shared_module/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./modules/shared_module/pages/home/pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/shared_module/pages/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./modules/shared_module/pages/auth/pages/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  // Platform Admin Routes
  {
    path: 'platform',
    loadComponent: () =>
      import('./modules/platform_module/pages/dashboard/platform-dashboard/platform-dashboard.component').then(
        (m) => m.PlatformDashboardComponent
      ),
    canActivate: [authGuard, roleGuard(['PLATFORM_ADMIN'])],
    children: [
      {
        path: '',
        redirectTo: 'clients',
        pathMatch: 'full',
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./modules/platform_module/pages/clients/clients.component').then(
            (m) => m.ClientsComponent
          ),
      },
      {
        path: 'clients/new',
        loadComponent: () =>
          import('./modules/platform_module/pages/clients/add-client/add-client.component').then(
            (m) => m.AddClientComponent
          ),
      },
      {
        path: 'clients/edit/:id',
        loadComponent: () =>
          import('./modules/platform_module/pages/clients/edit-client/edit-client.component').then(
            (m) => m.EditClientComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./modules/platform_module/pages/users/users.component').then(
            (m) => m.PlatformUsersComponent
          ),
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./modules/platform_module/pages/users/add-user/add-user.component').then(
            (m) => m.AddUserComponent
          ),
      },
      {
        path: 'users/edit/:id',
        loadComponent: () =>
          import('./modules/platform_module/pages/users/edit-user/edit-user.component').then(
            (m) => m.EditUserComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./modules/platform_module/pages/settings/settings.component').then(
            (m) => m.PlatformSettingsComponent
          ),
      },
    ],
  },
  // Client Admin Routes
  {
    path: 'client',
    loadComponent: () =>
      import('./modules/client_module/pages/dashboard/client-dashboard/client-dashboard.component').then(
        (m) => m.ClientDashboardComponent
      ),
    canActivate: [authGuard, roleGuard(['CLIENT_ADMIN'])],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./modules/client_module/pages/users/users.component').then(
            (m) => m.ClientUsersComponent
          ),
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./modules/platform_module/pages/users/add-user/add-user.component').then(
            (m) => m.AddUserComponent
          ),
      },
      {
        path: 'users/edit/:id',
        loadComponent: () =>
          import('./modules/platform_module/pages/users/edit-user/edit-user.component').then(
            (m) => m.EditUserComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./modules/client_module/pages/settings/settings.component').then(
            (m) => m.ClientSettingsComponent
          ),
      },
    ],
  },
  // Client User Routes (Workflow Module)
  {
    path: 'workflow',
    loadComponent: () =>
      import('./modules/workflow_module/pages/dashboard/user-dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
    canActivate: [authGuard, roleGuard(['CLIENT_USER'])],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./modules/workflow_module/pages/list/list.component').then(
            (m) => m.WorkflowListComponent
          ),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./modules/workflow_module/pages/history/history.component').then(
            (m) => m.WorkflowHistoryComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./modules/workflow_module/pages/settings/settings.component').then(
            (m) => m.WorkflowSettingsComponent
          ),
      },
    ],
  },
  // Workflow Designer (accessible to CLIENT_USER)
  {
    path: 'designer',
    loadComponent: () =>
      import('./modules/workflow_module/pages/workflow-designer/workflow-designer.component').then(
        (m) => m.WorkflowDesignerComponent
      ),
    canActivate: [authGuard, roleGuard(['CLIENT_USER'])],
  },
  // Legacy dashboard route - redirect based on role
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./modules/shared_module/pages/dashboard-redirect/dashboard-redirect.component').then(
        (m) => m.DashboardRedirectComponent
      ),
    canActivate: [authGuard],
  },
];
