import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../services/user.service';
import { ClientService, Client } from '../../../services/client.service';

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
  private userService = inject(UserService);
  private clientService = inject(ClientService);

  // Icons
  faSave = faSave;

  // Form
  userForm!: FormGroup;
  clients: Client[] = [];
  loadingClients = false;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
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

      const userData: any = {
        username: this.userForm.value.username.trim(),
        clientId: this.userForm.value.clientId
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
          // Navigate back to users list
          this.router.navigate(['/platform/users']);
        },
        error: (err) => {
          console.error('Error creating user:', err);
          this.error = err.error?.body?.message || err.error?.message || 'Failed to create user. Please try again.';
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
    this.router.navigate(['/platform/users']);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.touched || control.dirty));
  }
}