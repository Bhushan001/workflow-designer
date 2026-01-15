import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../services/user.service';
import { ClientService, Client } from '../../../services/client.service';
import { ToastService } from '@shared/services/toast.service';
import { extractErrorMessage } from '@shared/utils/error.utils';
import { PasswordPolicyService } from '@shared/services/password-policy.service';
import { passwordValidator } from '@shared/validators/password.validator';
import { COUNTRIES } from '@shared/utils/countries';
import { SelectedClientService } from '@shared/services/selected-client.service';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private clientService = inject(ClientService);
  private toastService = inject(ToastService);
  private passwordPolicyService = inject(PasswordPolicyService);
  private selectedClientService = inject(SelectedClientService);
  private authService = inject(AuthService);

  // Icons
  faSave = faSave;

  // Form
  userForm!: FormGroup;
  clients: Client[] = [];
  loadingClients = false;
  loading = false;
  error: string | null = null;
  passwordRequirements = '';
  countries = COUNTRIES;
  isClientRoute = false;
  selectedClient: Client | null = null;

  ngOnInit(): void {
    // Check if this is a client route
    this.isClientRoute = this.router.url.includes('/client/users/new');
    
    this.initForm();
    
    if (this.isClientRoute) {
      // For client route, load selected client and set it as readonly
      this.loadSelectedClient();
    } else {
      // For platform route, load all clients
      this.loadClients();
    }
    
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
      this.userForm.patchValue({ clientId: currentClient.id });
      this.userForm.get('clientId')?.disable(); // Make it readonly
      this.loadingClients = false;
    } else {
      // Load client if not already loaded
      this.selectedClientService.loadSelectedClient().subscribe({
        next: (client) => {
          if (client) {
            this.selectedClient = client;
            this.clients = [client];
            this.userForm.patchValue({ clientId: client.id });
            this.userForm.get('clientId')?.disable(); // Make it readonly
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
    if (this.userForm.valid) {
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
      }
      if (this.userForm.value.password?.trim()) {
        userData.password = this.userForm.value.password;
      }
      if (this.userForm.value.firstName?.trim()) {
        userData.firstName = this.userForm.value.firstName.trim();
      }
      if (this.userForm.value.lastName?.trim()) {
        userData.lastName = this.userForm.value.lastName.trim();
      }
      if (this.userForm.value.birthDate) {
        userData.birthDate = this.userForm.value.birthDate;
      }
      if (this.userForm.value.country?.trim()) {
        userData.country = this.userForm.value.country.trim();
      }

      this.userService.createUser(userData).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastService.showToast('success', 'User Created', `User "${userData.username}" has been created successfully.`);
          // Navigate back to users list based on route
          if (this.isClientRoute) {
            this.router.navigate(['/client/users']);
          } else {
            this.router.navigate(['/platform/users']);
          }
        },
        error: (err) => {
          console.error('Error creating user:', err);
          const errorMsg = extractErrorMessage(err) || 'Failed to create user. Please try again.';
          this.error = errorMsg;
          this.toastService.showToast('danger', 'User Creation Failed', errorMsg);
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