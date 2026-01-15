import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import { ClientSettingsService } from '../../services/client-settings.service';
import { ClientSettings } from '../../models/settings.types';
import { ApiResponse } from '@shared/models/auth.types';
import { ToastService } from '@shared/services/toast.service';
import { extractErrorMessage } from '@shared/utils/error.utils';
import { SelectedClientService } from '@shared/services/selected-client.service';

@Component({
  selector: 'app-client-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class ClientSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(ClientSettingsService);
  private toastService = inject(ToastService);
  private selectedClientService = inject(SelectedClientService);

  // Icons
  faSave = faSave;
  faUndo = faUndo;

  // Form
  settingsForm!: FormGroup;
  loading = false;
  saving = false;
  error: string | null = null;
  currentSettings: ClientSettings | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadSettings();
  }

  initForm(): void {
    this.settingsForm = this.fb.group({
      // Basic Information
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      description: [''],
      
      // Contact Information
      contactEmail: ['', [Validators.email]],
      contactPhone: [''],
      contactPersonName: [''],
      billingContactEmail: ['', [Validators.email]],
      
      // Business Information
      websiteUrl: ['', [Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]],
      industry: [''],
      companySize: [''],
      
      // Configuration
      timeZone: ['UTC'],
      locale: ['en']
    });
  }

  loadSettings(): void {
    this.loading = true;
    this.error = null;
    
    // Ensure selected client is loaded first
    const selectedClient = this.selectedClientService.getSelectedClient();
    if (!selectedClient) {
      this.selectedClientService.loadSelectedClient().subscribe({
        next: () => {
          this.fetchSettings();
        },
        error: (err) => {
          console.error('Error loading client:', err);
          this.error = 'Failed to load client information.';
          this.loading = false;
        }
      });
    } else {
      this.fetchSettings();
    }
  }

  private fetchSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (response: ApiResponse<ClientSettings>) => {
        if (response.body) {
          this.currentSettings = response.body;
          this.populateForm(response.body);
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading settings:', err);
        this.error = extractErrorMessage(err) || 'Failed to load settings';
        this.loading = false;
        this.toastService.showToast('danger', 'Error', this.error);
      }
    });
  }

  populateForm(settings: ClientSettings): void {
    this.settingsForm.patchValue({
      name: settings.name || '',
      description: settings.description || '',
      contactEmail: settings.contactEmail || '',
      contactPhone: settings.contactPhone || '',
      contactPersonName: settings.contactPersonName || '',
      billingContactEmail: settings.billingContactEmail || '',
      websiteUrl: settings.websiteUrl || '',
      industry: settings.industry || '',
      companySize: settings.companySize || '',
      timeZone: settings.timeZone || 'UTC',
      locale: settings.locale || 'en'
    });
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.markFormGroupTouched(this.settingsForm);
      return;
    }

    this.saving = true;
    this.error = null;

    const formValue = this.settingsForm.value;
    const updateData: Partial<ClientSettings> = {
      ...this.currentSettings,
      name: formValue.name,
      description: formValue.description || null,
      contactEmail: formValue.contactEmail || null,
      contactPhone: formValue.contactPhone || null,
      contactPersonName: formValue.contactPersonName || null,
      billingContactEmail: formValue.billingContactEmail || null,
      websiteUrl: formValue.websiteUrl || null,
      industry: formValue.industry || null,
      companySize: formValue.companySize || null,
      timeZone: formValue.timeZone,
      locale: formValue.locale
    };

    this.settingsService.updateSettings(updateData).subscribe({
      next: (response: ApiResponse<ClientSettings>) => {
        if (response.body) {
          this.currentSettings = response.body;
          this.populateForm(response.body);
          this.toastService.showToast('success', 'Success', 'Settings updated successfully');
        }
        this.saving = false;
      },
      error: (err: any) => {
        console.error('Error updating settings:', err);
        this.error = extractErrorMessage(err) || 'Failed to update settings';
        this.toastService.showToast('danger', 'Error', this.error);
        this.saving = false;
      }
    });
  }

  resetForm(): void {
    if (this.currentSettings) {
      this.populateForm(this.currentSettings);
    }
    this.error = null;
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.settingsForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
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

  get clientCode(): string {
    return this.currentSettings?.clientCode || '—';
  }

  get status(): string {
    return this.currentSettings?.status || '—';
  }

  get maxUsers(): number | string {
    return this.currentSettings?.maxUsers ?? '—';
  }

  get maxWorkflows(): number | string {
    return this.currentSettings?.maxWorkflows ?? '—';
  }
}
