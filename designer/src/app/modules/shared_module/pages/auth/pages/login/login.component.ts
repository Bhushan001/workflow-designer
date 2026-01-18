import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocket, faEnvelope, faLock, faArrowRight, faBolt } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '@shared/layout/navbar/navbar.component';
import { AuthService } from '@shared/services/auth.service';
import { LoginRequest } from '@shared/models/auth.types';
import { ToastService } from '@shared/services/toast.service';
import { extractErrorMessage } from '@shared/utils/error.utils';
import { SelectedClientService } from '@shared/services/selected-client.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  faRocket = faRocket;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faArrowRight = faArrowRight;
  faBolt = faBolt;
  
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastService,
    private selectedClientService: SelectedClientService
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const identifier = this.loginForm.get('identifier')?.value?.trim();
      const password = this.loginForm.get('password')?.value;
      
      // Determine if identifier is email or username
      const isEmail = this.isEmail(identifier);
      const loginRequest: LoginRequest = {
        password: password
      };
      
      if (isEmail) {
        loginRequest.email = identifier;
      } else {
        loginRequest.username = identifier;
      }
      
      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.body) {
            this.toastService.showToast('success', 'Login Successful', 'Welcome back!');
            // Load selected client if user has a clientId (CLIENT_ADMIN or CLIENT_USER)
            const user = response.body.userProfile;
            if (user.clientId && (user.roles.includes('CLIENT_ADMIN') || user.roles.includes('CLIENT_USER'))) {
              this.selectedClientService.loadSelectedClient().subscribe({
                next: () => {
                  this.redirectBasedOnRole();
                },
                error: () => {
                  // Still redirect even if client loading fails
                  this.redirectBasedOnRole();
                }
              });
            } else {
              this.redirectBasedOnRole();
            }
          } else {
            this.errorMessage = 'Invalid response from server. Please try again.';
            this.toastService.showToast('danger', 'Login Failed', 'Invalid response from server. Please try again.');
          }
        },
        error: (error) => {
          this.isLoading = false;
          const errorMsg = extractErrorMessage(error) || 'Invalid username/email or password. Please try again.';
          this.errorMessage = errorMsg;
          this.toastService.showToast('danger', 'Login Failed', errorMsg);
          console.error('Login failed:', error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private isEmail(value: string): boolean {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private redirectBasedOnRole(): void {
    const primaryRole = this.authService.getPrimaryRole();
    
    // Get return URL from route parameters or default to role-based dashboard
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
    
    if (returnUrl) {
      this.router.navigate([returnUrl]);
      return;
    }

    // Redirect based on user role
    if (primaryRole === 'PLATFORM_ADMIN') {
      this.router.navigate(['/platform']);
    } else if (primaryRole === 'CLIENT_ADMIN') {
      this.router.navigate(['/client']);
    } else if (primaryRole === 'CLIENT_USER') {
      this.router.navigate(['/workflow']);
    } else {
      // Fallback to login if role is unknown
      this.errorMessage = 'Unknown user role. Please contact administrator.';
      this.authService.logout();
    }
  }
  
  get identifier() {
    return this.loginForm.get('identifier');
  }
  
  get password() {
    return this.loginForm.get('password');
  }
  
  fillMockCredentials(): void {
    // Fill form with sample credentials for testing
    // Users can modify these values as needed
    this.loginForm.patchValue({
      identifier: 'platform_admin',
      password: 'Admin@123'
    });
    this.errorMessage = '';
    // Mark fields as touched to show validation state
    this.loginForm.get('identifier')?.markAsTouched();
    this.loginForm.get('password')?.markAsTouched();
  }

  fillClientAdminCredentials(): void {
    // Fill form with client admin credentials for testing
    this.loginForm.patchValue({
      identifier: 'bhushan001',
      password: 'Bhushan@123'
    });
    this.errorMessage = '';
    // Mark fields as touched to show validation state
    this.loginForm.get('identifier')?.markAsTouched();
    this.loginForm.get('password')?.markAsTouched();
  }

  fillClientUserCredentials(): void {
    // Fill form with client user credentials for testing
    this.loginForm.patchValue({
      identifier: 'bhushangadekar',
      password: 'Bhushan@123'
    });
    this.errorMessage = '';
    // Mark fields as touched to show validation state
    this.loginForm.get('identifier')?.markAsTouched();
    this.loginForm.get('password')?.markAsTouched();
  }
}
