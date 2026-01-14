import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocket, faEnvelope, faLock, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '@layout/navbar/navbar.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, NavbarComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  faRocket = faRocket;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUser = faUser;
  faArrowRight = faArrowRight;
  
  signupForm: FormGroup;
  isLoading = false;
  
  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
  
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      // TODO: Implement signup logic
      console.log('Signup form submitted:', this.signupForm.value);
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to dashboard after successful signup
        this.router.navigate(['/dashboard']);
      }, 1000);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  
  get firstName() {
    return this.signupForm.get('firstName');
  }
  
  get lastName() {
    return this.signupForm.get('lastName');
  }
  
  get email() {
    return this.signupForm.get('email');
  }
  
  get password() {
    return this.signupForm.get('password');
  }
  
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  
  get agreeToTerms() {
    return this.signupForm.get('agreeToTerms');
  }
}
