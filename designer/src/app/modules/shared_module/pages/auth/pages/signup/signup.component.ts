import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocket, faEnvelope, faLock, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '@shared/layout/navbar/navbar.component';
import { PasswordPolicyService } from '@shared/services/password-policy.service';
import { passwordValidator } from '@shared/validators/password.validator';
import { COUNTRIES } from '@shared/utils/countries';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, NavbarComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  faRocket = faRocket;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUser = faUser;
  faArrowRight = faArrowRight;
  
  signupForm: FormGroup;
  isLoading = false;
  passwordRequirements = '';
  countries = COUNTRIES;
  private passwordPolicyService = inject(PasswordPolicyService);
  
  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      country: [''],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Load password policy and apply validator
    this.passwordPolicyService.loadPasswordPolicy().subscribe(policy => {
      this.passwordRequirements = this.passwordPolicyService.getPasswordRequirementsMessage();
      // Update password field with dynamic validator (required for signup)
      const passwordControl = this.signupForm.get('password');
      if (passwordControl) {
        passwordControl.setValidators([
          Validators.required,
          passwordValidator(this.passwordPolicyService, false) // false = don't add required, we already have it
        ]);
        passwordControl.updateValueAndValidity();
      }
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
  
  get country() {
    return this.signupForm.get('country');
  }

  get agreeToTerms() {
    return this.signupForm.get('agreeToTerms');
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.touched || control.dirty));
  }
}
