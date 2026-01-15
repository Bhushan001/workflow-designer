import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: '<div>Redirecting...</div>',
})
export class DashboardRedirectComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const primaryRole = this.authService.getPrimaryRole();
    
    // Redirect based on user role
    if (primaryRole === 'PLATFORM_ADMIN') {
      this.router.navigate(['/platform']);
    } else if (primaryRole === 'CLIENT_ADMIN') {
      this.router.navigate(['/client']);
    } else if (primaryRole === 'CLIENT_USER') {
      this.router.navigate(['/workflow']);
    } else {
      // Fallback to login if role is unknown
      this.router.navigate(['/login']);
    }
  }
}
