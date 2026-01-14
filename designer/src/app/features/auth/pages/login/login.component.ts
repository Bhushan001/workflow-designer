import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocket, faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
  
  loginForm: FormGroup;
  isLoading = false;
  
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      // TODO: Implement login logic
      console.log('Login form submitted:', this.loginForm.value);
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to designer or dashboard after successful login
        // this.router.navigate(['/designer']);
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
}
