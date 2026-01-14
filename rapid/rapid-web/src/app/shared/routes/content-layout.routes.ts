import { Routes } from '@angular/router';
import { AuthComponent } from '../../auth/auth.component';
import { SignupComponent } from '../../auth/sign-up/sign-up.component';
import { LoginComponent } from '../../auth/login/login.component';
import { ResetPasswordComponent } from '../../auth/reset-password/reset-password.component';

export const CONTENT_ROUTES: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        children: [
          { path: 'sign-up', component: SignupComponent },
          { path: 'login', component: LoginComponent },
          { path: 'reset-password', component: ResetPasswordComponent }
        ]
      }
];