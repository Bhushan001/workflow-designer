import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@shared/models/auth.types';

export interface PasswordPolicy {
  passwordMinLength?: number;
  passwordRequireUppercase?: boolean;
  passwordRequireLowercase?: boolean;
  passwordRequireNumbers?: boolean;
  passwordRequireSpecialChars?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordPolicyService {
  private http = inject(HttpClient);
  private baseUrl = environment.authApiUrl.replace('/auth', ''); // http://localhost:8081/api
  
  private policySubject = new BehaviorSubject<PasswordPolicy | null>(null);
  public policy$ = this.policySubject.asObservable();
  
  private loading = false;

  /**
   * Fetch password policy from backend and cache it
   * Uses public endpoint that doesn't require authentication
   */
  loadPasswordPolicy(): Observable<PasswordPolicy> {
    if (this.policySubject.value) {
      // Policy already loaded, return cached value
      return of(this.normalizePolicy(this.policySubject.value));
    }

    if (this.loading) {
      // Already loading, return the observable
      return this.policy$.pipe(
        map(policy => policy ? this.normalizePolicy(policy) : this.getDefaultPolicy())
      );
    }

    this.loading = true;

    return this.http.get<ApiResponse<PasswordPolicy>>(`${this.baseUrl}/platform/settings/password-policy`).pipe(
      map(response => {
        const policy = response.body || this.getDefaultPolicy();
        const normalizedPolicy = this.normalizePolicy(policy);
        this.policySubject.next(normalizedPolicy);
        return normalizedPolicy;
      }),
      tap(() => {
        this.loading = false;
      }),
      catchError(error => {
        console.error('Error loading password policy, using defaults:', error);
        // Use default policy if API call fails
        const defaultPolicy = this.getDefaultPolicy();
        this.policySubject.next(defaultPolicy);
        this.loading = false;
        return of(defaultPolicy);
      })
    );
  }

  /**
   * Normalize policy to ensure all fields have default values
   */
  private normalizePolicy(policy: PasswordPolicy): PasswordPolicy {
    return {
      passwordMinLength: policy.passwordMinLength ?? 8,
      passwordRequireUppercase: policy.passwordRequireUppercase ?? true,
      passwordRequireLowercase: policy.passwordRequireLowercase ?? true,
      passwordRequireNumbers: policy.passwordRequireNumbers ?? true,
      passwordRequireSpecialChars: policy.passwordRequireSpecialChars ?? true
    };
  }

  /**
   * Get default policy
   */
  private getDefaultPolicy(): PasswordPolicy {
    return {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSpecialChars: true
    };
  }

  /**
   * Get current password policy (synchronous, returns cached value)
   */
  getPasswordPolicy(): PasswordPolicy | null {
    if (this.policySubject.value) {
      return this.normalizePolicy(this.policySubject.value);
    }
    return this.getDefaultPolicy();
  }

  /**
   * Get password requirements message for display
   */
  getPasswordRequirementsMessage(): string {
    const policy = this.getPasswordPolicy() || this.getDefaultPolicy();

    const requirements: string[] = [];
    requirements.push(`at least ${policy.passwordMinLength || 8} characters`);
    
    if (policy.passwordRequireUppercase) {
      requirements.push('one uppercase letter');
    }
    if (policy.passwordRequireLowercase) {
      requirements.push('one lowercase letter');
    }
    if (policy.passwordRequireNumbers) {
      requirements.push('one number');
    }
    if (policy.passwordRequireSpecialChars) {
      requirements.push('one special character');
    }

    return `Password must contain: ${requirements.join(', ')}.`;
  }

  /**
   * Validate password against current policy
   */
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const policy = this.getPasswordPolicy() || this.getDefaultPolicy();

    const errors: string[] = [];
    const minLength = policy.passwordMinLength || 8;

    if (!password || password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }

    if (policy.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (policy.passwordRequireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (policy.passwordRequireNumbers && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (policy.passwordRequireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Refresh password policy from backend
   */
  refreshPasswordPolicy(): Observable<PasswordPolicy> {
    this.policySubject.next(null); // Clear cache
    return this.loadPasswordPolicy();
  }
}
