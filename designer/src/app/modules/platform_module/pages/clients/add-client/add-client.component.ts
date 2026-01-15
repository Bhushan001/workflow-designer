import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientService = inject(ClientService);

  // Icons
  faSave = faSave;

  // Form
  clientForm!: FormGroup;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      clientCode: ['', [Validators.required, this.alphanumericValidator(), Validators.minLength(5), Validators.maxLength(5)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [''],
      contactEmail: ['', [Validators.email]],
      contactPhone: [''],
      contactPersonName: [''],
      websiteUrl: ['', [this.urlValidator()]],
      industry: [''],
      companySize: [''],
      status: ['ACTIVE', Validators.required],
      timeZone: [''],
      locale: ['en'],
      maxUsers: ['', [this.positiveIntegerValidator()]],
      maxWorkflows: ['', [this.positiveIntegerValidator()]],
      billingContactEmail: ['', [Validators.email]],
      internalNotes: ['']
    });
  }

  // Custom validators
  alphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const alphanumericRegex = /^[A-Za-z0-9]+$/;
      const isValid = alphanumericRegex.test(control.value);
      return isValid ? null : { alphanumeric: { value: control.value } };
    };
  }

  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      try {
        new URL(control.value.startsWith('http') ? control.value : `https://${control.value}`);
        return null;
      } catch {
        return { invalidUrl: { value: control.value } };
      }
    };
  }

  positiveIntegerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const num = Number(control.value);
      return Number.isInteger(num) && num > 0 ? null : { positiveInteger: { value: control.value } };
    };
  }

  // Form control getters
  get clientCode() { return this.clientForm.get('clientCode'); }
  get name() { return this.clientForm.get('name'); }
  get description() { return this.clientForm.get('description'); }
  get contactEmail() { return this.clientForm.get('contactEmail'); }
  get contactPhone() { return this.clientForm.get('contactPhone'); }
  get contactPersonName() { return this.clientForm.get('contactPersonName'); }
  get websiteUrl() { return this.clientForm.get('websiteUrl'); }
  get industry() { return this.clientForm.get('industry'); }
  get companySize() { return this.clientForm.get('companySize'); }
  get status() { return this.clientForm.get('status'); }
  get timeZone() { return this.clientForm.get('timeZone'); }
  get locale() { return this.clientForm.get('locale'); }
  get maxUsers() { return this.clientForm.get('maxUsers'); }
  get maxWorkflows() { return this.clientForm.get('maxWorkflows'); }
  get billingContactEmail() { return this.clientForm.get('billingContactEmail'); }
  get internalNotes() { return this.clientForm.get('internalNotes'); }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.loading = true;
      this.error = null;

      const clientData: any = {
        clientCode: this.clientForm.value.clientCode.trim().toUpperCase(),
        name: this.clientForm.value.name.trim(),
        status: this.clientForm.value.status || 'ACTIVE'
      };

      // Add optional fields only if they have values
      if (this.clientForm.value.description?.trim()) {
        clientData.description = this.clientForm.value.description.trim();
      }
      if (this.clientForm.value.contactEmail?.trim()) {
        clientData.contactEmail = this.clientForm.value.contactEmail.trim();
      }
      if (this.clientForm.value.contactPhone?.trim()) {
        clientData.contactPhone = this.clientForm.value.contactPhone.trim();
      }
      if (this.clientForm.value.contactPersonName?.trim()) {
        clientData.contactPersonName = this.clientForm.value.contactPersonName.trim();
      }
      if (this.clientForm.value.websiteUrl?.trim()) {
        let url = this.clientForm.value.websiteUrl.trim();
        if (!url.startsWith('http')) {
          url = `https://${url}`;
        }
        clientData.websiteUrl = url;
      }
      if (this.clientForm.value.industry?.trim()) {
        clientData.industry = this.clientForm.value.industry.trim();
      }
      if (this.clientForm.value.companySize?.trim()) {
        clientData.companySize = this.clientForm.value.companySize.trim();
      }
      if (this.clientForm.value.timeZone?.trim()) {
        clientData.timeZone = this.clientForm.value.timeZone.trim();
      }
      if (this.clientForm.value.locale?.trim()) {
        clientData.locale = this.clientForm.value.locale.trim();
      }
      if (this.clientForm.value.maxUsers) {
        clientData.maxUsers = parseInt(this.clientForm.value.maxUsers);
      }
      if (this.clientForm.value.maxWorkflows) {
        clientData.maxWorkflows = parseInt(this.clientForm.value.maxWorkflows);
      }
      if (this.clientForm.value.billingContactEmail?.trim()) {
        clientData.billingContactEmail = this.clientForm.value.billingContactEmail.trim();
      }
      if (this.clientForm.value.internalNotes?.trim()) {
        clientData.internalNotes = this.clientForm.value.internalNotes.trim();
      }

      this.clientService.createClient(clientData).subscribe({
        next: (response) => {
          this.loading = false;
          // Navigate back to clients list
          this.router.navigate(['/platform/clients']);
        },
        error: (err) => {
          console.error('Error creating client:', err);
          this.error = err.error?.body?.message || err.error?.message || 'Failed to create client. Please try again.';
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.clientForm.controls).forEach(key => {
        this.clientForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/platform/clients']);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.clientForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.touched || control.dirty));
  }
}