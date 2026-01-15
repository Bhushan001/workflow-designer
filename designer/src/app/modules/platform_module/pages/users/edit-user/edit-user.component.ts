import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { UserService, User } from '../../../services/user.service';
import { ClientService, Client } from '../../../services/client.service';
import { ToastService } from '@shared/services/toast.service';
import { extractErrorMessage } from '@shared/utils/error.utils';
import { PasswordPolicyService } from '@shared/services/password-policy.service';
import { passwordValidator } from '@shared/validators/password.validator';
import { COUNTRIES } from '@shared/utils/countries';
import { SelectedClientService } from '@shared/services/selected-client.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private clientService = inject(ClientService);
  private toastService = inject(ToastService);
  private passwordPolicyService = inject(PasswordPolicyService);
  private selectedClientService = inject(SelectedClientService);

  // Icons
  faSave = faSave;

  // Form
  userForm!: FormGroup;
  clients: Client[] = [];
  loadingClients = false;
  loading = false;
  loadingUser = false;
  error: string | null = null;
  userId: string | null = null;
  passwordRequirements = '';
  countries = COUNTRIES;
  isClientRoute = false;
  selectedClient: Client | null = null;

  ngOnInit(): void {
    // Check if this is a client route
    this.isClientRoute = this.router.url.includes('/client/users/edit/');
    
    this.userId = this.route.snapshot.paramMap.get('id');
    if (!this.userId) {
      this.error = 'User ID is required';
      return;
    }
    this.initForm();
    
    if (this.isClientRoute) {
      // For client route, load selected client and set it as readonly
      this.loadSelectedClient();
    } else {
      // For platform route, load all clients
      this.loadClients();
    }
    
    this.loadUser();
    this.loadPasswordPolicy();
  }

  loadPasswordPolicy(): void {
    this.passwordPolicyService.loadPasswordPolicy().subscribe(policy => {
      this.passwordRequirements = this.passwordPolicyService.getPasswordRequirementsMessage();
      // Update password field with dynamic validator
      const passwordControl = this.userForm.get('password');
      if (passwordControl) {
        passwordControl.setValidators([
          passwordValidator(this.passwordPolicyService)
        ]);
        passwordControl.updateValueAndValidity();
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.email]],
      password: [''],
      firstName: [''],
      lastName: [''],
      birthDate: [''],
      country: [''],
      clientId: ['', Validators.required]
    });
  }

  loadClients(): void {
    this.loadingClients = true;
    this.clientService.getAllClients().subscribe({
      next: (response) => {
        if (response.body) {
          this.clients = response.body;
        }
        this.loadingClients = false;
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.loadingClients = false;
      }
    });
  }

  loadSelectedClient(): void {
    this.loadingClients = true;
    const currentClient = this.selectedClientService.getSelectedClient();
    
    if (currentClient) {
      this.selectedClient = currentClient;
      this.clients = [currentClient]; // Only show the current client
      this.loadingClients = false;
      // After user is loaded, we'll disable the client field in populateForm if it matches
    } else {
      // Load client if not already loaded
      this.selectedClientService.loadSelectedClient().subscribe({
        next: (client) => {
          if (client) {
            this.selectedClient = client;
            this.clients = [client];
          } else {
            this.error = 'Unable to load client information.';
            this.toastService.showToast('danger', 'Error', this.error);
          }
          this.loadingClients = false;
        },
        error: (err) => {
          console.error('Error loading selected client:', err);
          this.error = extractErrorMessage(err) || 'Failed to load client information.';
          this.toastService.showToast('danger', 'Error', this.error);
          this.loadingClients = false;
        }
      });
    }
  }

  loadUser(): void {
    if (!this.userId) {
      return;
    }

    this.loadingUser = true;
    this.error = null;

    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        if (response.body) {
          const user = response.body;
          this.populateForm(user);
        }
        this.loadingUser = false;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.error = err.error?.message || 'Failed to load user. Please try again.';
        this.loadingUser = false;
      }
    });
  }

  populateForm(user: User): void {
    this.userForm.patchValue({
      username: user.username || '',
      email: user.email || '',
      password: '', // Never populate password field for security
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      birthDate: user.birthDate || '',
      country: user.country || '',
      clientId: user.clientId || ''
    });
    
    // If this is a client route, disable the client field
    if (this.isClientRoute) {
      this.userForm.get('clientId')?.disable();
    }
  }

  get username() {
    return this.userForm.get('username');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get birthDate() {
    return this.userForm.get('birthDate');
  }

  get country() {
    return this.userForm.get('country');
  }

  get clientId() {
    return this.userForm.get('clientId');
  }

  onSubmit(): void {
    if (this.userForm.valid && this.userId) {
      this.loading = true;
      this.error = null;

      // Get clientId value (handle disabled form control)
      const clientIdValue = this.userForm.get('clientId')?.disabled 
        ? this.userForm.get('clientId')?.value 
        : this.userForm.value.clientId;

      const userData: any = {
        username: this.userForm.value.username.trim(),
        clientId: clientIdValue
      };

      // Add optional fields only if they have values
      if (this.userForm.value.email?.trim()) {
        userData.email = this.userForm.value.email.trim();
      } else {
        userData.email = null; // Clear email if empty
      }
      // Only include password if provided (for updates, password is optional)
      if (this.userForm.value.password?.trim()) {
        userData.password = this.userForm.value.password;
      }
      if (this.userForm.value.firstName?.trim()) {
        userData.firstName = this.userForm.value.firstName.trim();
      } else {
        userData.firstName = null;
      }
      if (this.userForm.value.lastName?.trim()) {
        userData.lastName = this.userForm.value.lastName.trim();
      } else {
        userData.lastName = null;
      }
      if (this.userForm.value.birthDate) {
        userData.birthDate = this.userForm.value.birthDate;
      } else {
        userData.birthDate = null;
      }
      if (this.userForm.value.country?.trim()) {
        userData.country = this.userForm.value.country.trim();
      } else {
        userData.country = null;
      }

      this.userService.updateUser(this.userId, userData).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastService.showToast('success', 'User Updated', `User "${userData.username}" has been updated successfully.`);
          // Navigate back to users list based on route
          if (this.isClientRoute) {
            this.router.navigate(['/client/users']);
          } else {
            this.router.navigate(['/platform/users']);
          }
        },
        error: (err) => {
          console.error('Error updating user:', err);
          const errorMsg = extractErrorMessage(err) || 'Failed to update user. Please try again.';
          this.error = errorMsg;
          this.toastService.showToast('danger', 'User Update Failed', errorMsg);
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    // Navigate back to users list based on route
    if (this.isClientRoute) {
      this.router.navigate(['/client/users']);
    } else {
      this.router.navigate(['/platform/users']);
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.touched || control.dirty));
  }
}
