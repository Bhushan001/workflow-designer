import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocket, faEnvelope, faLock, faArrowRight, faBolt } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '@layout/navbar/navbar.component';

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
  
  // Mock credentials for demo purposes
  private readonly MOCK_CREDENTIALS = {
    email: 'admin@example.com',
    password: 'admin123'
  };
  
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      
      // Simulate API call delay
      setTimeout(() => {
        // Mock authentication check
        if (email === this.MOCK_CREDENTIALS.email && password === this.MOCK_CREDENTIALS.password) {
          // Successful login
          console.log('Login successful');
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        } else {
          // Failed login
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password. Please try again.';
          console.log('Login failed: Invalid credentials');
        }
      }, 1000);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  
  get email() {
    return this.loginForm.get('email');
  }
  
  get password() {
    return this.loginForm.get('password');
  }
  
  fillMockCredentials(): void {
    this.loginForm.patchValue({
      email: this.MOCK_CREDENTIALS.email,
      password: this.MOCK_CREDENTIALS.password
    });
    this.errorMessage = '';
    // Mark fields as touched to show validation state
    this.loginForm.get('email')?.markAsTouched();
    this.loginForm.get('password')?.markAsTouched();
  }
}
