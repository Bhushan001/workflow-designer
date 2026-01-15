import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const user = authService.getCurrentUser();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    // Check if user has any of the allowed roles
    const hasRole = allowedRoles.some(role => user.roles.includes(role));
    
    if (!hasRole) {
      // Redirect to appropriate dashboard based on user's role
      const primaryRole = authService.getPrimaryRole();
      if (primaryRole === 'PLATFORM_ADMIN') {
        router.navigate(['/platform']);
      } else if (primaryRole === 'CLIENT_ADMIN') {
        router.navigate(['/client']);
      } else {
        router.navigate(['/workflow']);
      }
      return false;
    }

    return true;
  };
};
