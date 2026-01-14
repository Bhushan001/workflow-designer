import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Client } from '../../model/client.model';


@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    birthDate: FormControl<string>;
    country: FormControl<string>;
    clientId: FormControl<string>;
  }>;

  clients: Client[] = [];
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private toast: ToastService,
    private _router: Router,
    private _registerService: RegisterService
  ) {
    this.signupForm = new FormGroup({
      username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      birthDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      country: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      clientId: new FormControl('', { nonNullable: true, validators: [Validators.required] }) // Initialize clientId
    },{
      validators: this.passwordsMatchValidator
    });
  }

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this._registerService.getClients().subscribe(
      (res: any)=>{
        this.clients = res.body;        
      },
      (err)=>{
        console.log(err);        
      }
    );
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    const { confirmPassword, ...payload } = this.signupForm.value;
    this._userService.signup(payload).subscribe({
      next: (res) => {
        this.toast.showToast('Success', 'User registered successfully', 'success');
        this.signupForm.reset();
        this._router.navigate(['auth','login']);
      },
      error: (err) => {
        this.toast.showToast('Error', 'Signup failed. Please try again.', 'danger');
        console.error(err);
      }
    });
  }

  get f() {
    return this.signupForm.controls;
  }
}
