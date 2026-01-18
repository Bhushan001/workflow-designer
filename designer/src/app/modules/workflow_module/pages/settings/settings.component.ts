import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faUndo, faBell, faPalette, faLanguage, faClock } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-workflow-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class WorkflowSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  // Icons
  faSave = faSave;
  faUndo = faUndo;
  faBell = faBell;
  faPalette = faPalette;
  faLanguage = faLanguage;
  faClock = faClock;

  // Form
  settingsForm!: FormGroup;
  saving = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.settingsForm = this.fb.group({
      // Notification Settings
      emailNotifications: [true],
      executionAlerts: [true],
      errorNotifications: [true],
      
      // Display Settings
      theme: ['light'],
      language: ['en'],
      timezone: ['UTC'],
      
      // Workflow Settings
      autoSave: [true],
      autoSaveInterval: [30, [Validators.min(5), Validators.max(300)]],
      showNodeLabels: [true],
      showGrid: [true],
      
      // Execution Settings
      defaultTimeout: [300, [Validators.min(10), Validators.max(3600)]],
      maxConcurrentExecutions: [5, [Validators.min(1), Validators.max(20)]]
    });
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.saving = true;
      
      // Simulate save operation
      setTimeout(() => {
        this.saving = false;
        this.toastService.showToast('success', 'Settings Saved', 'Your workflow settings have been saved successfully.');
      }, 500);
    } else {
      this.settingsForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.initForm();
    this.toastService.showToast('info', 'Settings Reset', 'Settings have been reset to default values.');
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.settingsForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }
}
