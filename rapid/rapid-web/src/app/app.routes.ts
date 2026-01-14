import { Routes } from '@angular/router';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { Full_ROUTES } from './shared/routes/full-layout.routes';
import { ADMIN_ROUTES } from './shared/routes/admin-layout.routes';
import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
      path: '', component: FullLayoutComponent,
      data: { title: 'full Views' },
      canActivate: [AuthGuard],
      children: Full_ROUTES
    },
    {
      path: '', component: AdminLayoutComponent,
      data: { title: 'Admin Views' },
      canActivate: [AuthGuard],
      children: ADMIN_ROUTES
    },
    { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
    { path: '**', redirectTo: 'auth/login' }
  ];
