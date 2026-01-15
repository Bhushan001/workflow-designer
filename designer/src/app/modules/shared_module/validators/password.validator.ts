import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PasswordPolicyService } from '../services/password-policy.service';

/**
 * Creates a password validator that uses the current password policy
 * This validator only validates if password is provided (allows empty for optional fields)
 */
export function passwordValidator(policyService: PasswordPolicyService, required: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    
    // If password is empty and not required, don't validate
    if (!password || password.trim() === '') {
      if (required) {
        return { required: true };
      }
      return null; // Optional field, no validation needed
    }

    const validation = policyService.validatePassword(password);
    
    if (validation.valid) {
      return null;
    }

    // Return all errors in a structured way
    return {
      passwordPolicy: {
        errors: validation.errors,
        message: validation.errors.join(', ')
      }
    };
  };
}
