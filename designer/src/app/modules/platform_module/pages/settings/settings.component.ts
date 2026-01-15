import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from '../../services/settings.service';
import { PlatformSettings, SmtpTestRequest, SmtpTestResponse } from '../../models/settings.types';
import { ApiResponse } from '@shared/models/auth.types';

@Component({
  selector: 'app-platform-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class PlatformSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  // Icons
  faSave = faSave;
  faUndo = faUndo;

  // Form
  settingsForm!: FormGroup;
  loading = false;
  saving = false;
  testingSmtp = false;
  error: string | null = null;
  success: string | null = null;
  smtpTestMessage: string | null = null;
  currentSettings: PlatformSettings | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadSettings();
  }

  initForm(): void {
    this.settingsForm = this.fb.group({
      // General Settings
      platformName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      platformEmail: ['', [Validators.email]],
      defaultTimezone: ['UTC'],
      defaultLocale: ['en'],
      platformDescription: [''],
      
      // Security Settings
      passwordMinLength: [8, [Validators.required, Validators.min(4), Validators.max(128)]],
      passwordRequireUppercase: [true],
      passwordRequireLowercase: [true],
      passwordRequireNumbers: [true],
      passwordRequireSpecialChars: [true],
      sessionTimeoutMinutes: [30, [Validators.required, Validators.min(1), Validators.max(1440)]],
      jwtTokenExpirationHours: [24, [Validators.required, Validators.min(1), Validators.max(720)]],
      maxLoginAttempts: [5, [Validators.required, Validators.min(1), Validators.max(20)]],
      lockoutDurationMinutes: [15, [Validators.required, Validators.min(1), Validators.max(1440)]],
      enableEmailLogin: [true],
      
      // Default Quotas
      defaultMaxUsersPerClient: ['', [Validators.min(1)]],
      defaultMaxWorkflowsPerClient: ['', [Validators.min(1)]],
      defaultStorageQuotaMb: ['', [Validators.min(1)]],
      
      // Email/SMTP Configuration
      smtpHost: [''],
      smtpPort: [587, [Validators.min(1), Validators.max(65535)]],
      smtpUsername: [''],
      smtpPassword: [''],
      smtpFromEmail: ['', [Validators.email]],
      smtpFromName: [''],
      smtpEnableTls: [true],
      
      // SMTP Test
      smtpTestEmail: ['', [Validators.email]]
    });
  }

  loadSettings(): void {
    this.loading = true;
    this.error = null;
    
    this.settingsService.getSettings().subscribe({
      next: (response: ApiResponse<PlatformSettings>) => {
        if (response.body) {
          this.currentSettings = response.body;
          this.populateForm(response.body);
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading settings:', err);
        this.error = err.error?.message || 'Failed to load settings';
        this.loading = false;
      }
    });
  }

  populateForm(settings: PlatformSettings): void {
    this.settingsForm.patchValue({
      platformName: settings.platformName || '',
      platformEmail: settings.platformEmail || '',
      defaultTimezone: settings.defaultTimezone || 'UTC',
      defaultLocale: settings.defaultLocale || 'en',
      platformDescription: settings.platformDescription || '',
      
      // Security Settings
      passwordMinLength: settings.passwordMinLength ?? 8,
      passwordRequireUppercase: settings.passwordRequireUppercase ?? true,
      passwordRequireLowercase: settings.passwordRequireLowercase ?? true,
      passwordRequireNumbers: settings.passwordRequireNumbers ?? true,
      passwordRequireSpecialChars: settings.passwordRequireSpecialChars ?? true,
      sessionTimeoutMinutes: settings.sessionTimeoutMinutes ?? 30,
      jwtTokenExpirationHours: settings.jwtTokenExpirationHours ?? 24,
      maxLoginAttempts: settings.maxLoginAttempts ?? 5,
      lockoutDurationMinutes: settings.lockoutDurationMinutes ?? 15,
      enableEmailLogin: settings.enableEmailLogin ?? true,
      
      // Default Quotas
      defaultMaxUsersPerClient: settings.defaultMaxUsersPerClient ?? null,
      defaultMaxWorkflowsPerClient: settings.defaultMaxWorkflowsPerClient ?? null,
      defaultStorageQuotaMb: settings.defaultStorageQuotaMb ?? null,
      
      // Email/SMTP Configuration
      smtpHost: settings.smtpHost || '',
      smtpPort: settings.smtpPort ?? 587,
      smtpUsername: settings.smtpUsername || '',
      smtpPassword: '', // Never populate password field for security
      smtpFromEmail: settings.smtpFromEmail || '',
      smtpFromName: settings.smtpFromName || '',
      smtpEnableTls: settings.smtpEnableTls ?? true,
      smtpTestEmail: ''
    });
    
    // Handle null/empty values for quota fields (convert null to empty string for form inputs)
    if (this.settingsForm.get('defaultMaxUsersPerClient')?.value === null) {
      this.settingsForm.patchValue({ defaultMaxUsersPerClient: '' });
    }
    if (this.settingsForm.get('defaultMaxWorkflowsPerClient')?.value === null) {
      this.settingsForm.patchValue({ defaultMaxWorkflowsPerClient: '' });
    }
    if (this.settingsForm.get('defaultStorageQuotaMb')?.value === null) {
      this.settingsForm.patchValue({ defaultStorageQuotaMb: '' });
    }
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.markFormGroupTouched(this.settingsForm);
      return;
    }

    this.saving = true;
    this.error = null;
    this.success = null;

    const formValue = this.settingsForm.value;
    const updateData: PlatformSettings = {
      ...this.currentSettings,
      // General Settings
      platformName: formValue.platformName,
      platformEmail: formValue.platformEmail || null,
      defaultTimezone: formValue.defaultTimezone,
      defaultLocale: formValue.defaultLocale,
      platformDescription: formValue.platformDescription || null,
      
      // Security Settings
      passwordMinLength: formValue.passwordMinLength,
      passwordRequireUppercase: formValue.passwordRequireUppercase,
      passwordRequireLowercase: formValue.passwordRequireLowercase,
      passwordRequireNumbers: formValue.passwordRequireNumbers,
      passwordRequireSpecialChars: formValue.passwordRequireSpecialChars,
      sessionTimeoutMinutes: formValue.sessionTimeoutMinutes,
      jwtTokenExpirationHours: formValue.jwtTokenExpirationHours,
      maxLoginAttempts: formValue.maxLoginAttempts,
      lockoutDurationMinutes: formValue.lockoutDurationMinutes,
      enableEmailLogin: formValue.enableEmailLogin,
      
      // Default Quotas (convert empty strings to undefined)
      defaultMaxUsersPerClient: formValue.defaultMaxUsersPerClient && formValue.defaultMaxUsersPerClient.toString().trim() !== '' 
        ? parseInt(formValue.defaultMaxUsersPerClient.toString()) : undefined,
      defaultMaxWorkflowsPerClient: formValue.defaultMaxWorkflowsPerClient && formValue.defaultMaxWorkflowsPerClient.toString().trim() !== '' 
        ? parseInt(formValue.defaultMaxWorkflowsPerClient.toString()) : undefined,
      defaultStorageQuotaMb: formValue.defaultStorageQuotaMb && formValue.defaultStorageQuotaMb.toString().trim() !== '' 
        ? parseInt(formValue.defaultStorageQuotaMb.toString()) : undefined,
      
      // Email/SMTP Configuration (only include password if provided)
      smtpHost: formValue.smtpHost?.trim() || undefined,
      smtpPort: formValue.smtpPort ? parseInt(formValue.smtpPort.toString()) : undefined,
      smtpUsername: formValue.smtpUsername?.trim() || undefined,
      smtpPassword: formValue.smtpPassword?.trim() || undefined, // Only send if provided
      smtpFromEmail: formValue.smtpFromEmail?.trim() || undefined,
      smtpFromName: formValue.smtpFromName?.trim() || undefined,
      smtpEnableTls: formValue.smtpEnableTls
    };

    this.settingsService.updateSettings(updateData).subscribe({
      next: (response: ApiResponse<PlatformSettings>) => {
        if (response.body) {
          this.currentSettings = response.body;
          this.success = 'Settings saved successfully';
          setTimeout(() => {
            this.success = null;
          }, 3000);
        }
        this.saving = false;
      },
      error: (err: any) => {
        console.error('Error saving settings:', err);
        this.error = err.error?.message || 'Failed to save settings';
        this.saving = false;
      }
    });
  }

  onReset(): void {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      this.loading = true;
      this.error = null;
      this.success = null;

      this.settingsService.resetToDefaults().subscribe({
        next: (response: ApiResponse<PlatformSettings>) => {
          if (response.body) {
            this.currentSettings = response.body;
            this.populateForm(response.body);
            this.success = 'Settings reset to defaults';
            setTimeout(() => {
              this.success = null;
            }, 3000);
          }
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error resetting settings:', err);
          this.error = err.error?.message || 'Failed to reset settings';
          this.loading = false;
        }
      });
    }
  }

  onTestSmtp(): void {
    const formValue = this.settingsForm.value;
    const testEmail = formValue.smtpTestEmail;
    
    if (!testEmail || !testEmail.trim()) {
      this.error = 'Please enter a test email address';
      return;
    }

    if (!formValue.smtpHost || !formValue.smtpPort || !formValue.smtpUsername || !formValue.smtpPassword) {
      this.error = 'Please fill in all SMTP configuration fields (Host, Port, Username, Password)';
      return;
    }

    this.testingSmtp = true;
    this.error = null;
    this.smtpTestMessage = null;

    const testRequest: SmtpTestRequest = {
      smtpHost: formValue.smtpHost,
      smtpPort: parseInt(formValue.smtpPort),
      smtpUsername: formValue.smtpUsername,
      smtpPassword: formValue.smtpPassword,
      smtpEnableTls: formValue.smtpEnableTls ?? true,
      testEmail: testEmail.trim()
    };

    this.settingsService.testSmtpConnection(testRequest).subscribe({
      next: (response: ApiResponse<SmtpTestResponse>) => {
        if (response.body) {
          this.smtpTestMessage = response.body.message;
          if (response.body.success) {
            this.success = response.body.message;
            setTimeout(() => {
              this.success = null;
            }, 5000);
          } else {
            this.error = response.body.message;
          }
        }
        this.testingSmtp = false;
      },
      error: (err: any) => {
        console.error('Error testing SMTP:', err);
        this.error = err.error?.body?.message || err.error?.message || 'Failed to test SMTP configuration';
        this.smtpTestMessage = err.error?.body?.message || err.error?.message || 'SMTP test failed';
        this.testingSmtp = false;
      }
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.settingsForm.get(controlName);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
