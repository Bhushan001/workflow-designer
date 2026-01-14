import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports:[
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private _router: Router,
    private toastr: ToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  validateAuthToken() {
    this.userService.validateToken().subscribe(
      (res)=>{
        if(res) {
          localStorage.setItem("isAuthenticated", JSON.stringify(true));
        }        
      }
    );
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Handle successful login
          console.log('Login successful', response);
          const role: string = response.body.userProfile.roles[0];
          localStorage.setItem("authToken", response.body.token);
          localStorage.setItem("userProfile", JSON.stringify(response.body.userProfile));
          this.validateAuthToken();
          if(role === "SUPER_ADMIN") {
            this._router.navigate(['admin','home']);
          } else {
            this._router.navigate(['home','project-manager']);
          }
          this.toastr.showToast('Success', 'Loggen In Successfully', 'success'); // Display toast message
        },
        error: (error) => {                   
          this.toastr.showToast(error.error.errorCode, error.error.errorMessage, 'danger'); // Display toast message
        }
      });
    }
  }
}
