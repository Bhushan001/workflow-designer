import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  userProfile: any;

  constructor(
    private userService: UserService,
    private toast: ToastService,
    private router: Router
  ) {

  }


  ngOnInit(): void {
    const userProfileString = localStorage.getItem("userProfile");
    if (userProfileString !== null) {
      this.userProfile = JSON.parse(userProfileString);
    } else {
      console.log("userProfile not found in localStorage.");
      // Handle the case where userProfile is not found (e.g., set default value, show error message)
    }
  }

  onLogout() {
    this.userService.logout().subscribe({
      next: (response) => {
        // Handle successful logout (e.g., redirect to login)
        console.log('Logout successful', response);
        localStorage.clear();
        this.toast.showToast('Success', 'User logged out successfully', 'success');
        this.router.navigate(['auth', 'login']);

      },
      error: (error) => {
        // Handle logout error
        console.error('Logout failed', error);
        localStorage.clear();
        this.toast.showToast('Failed', 'User could not be logged out', 'error');
        this.router.navigate(['auth', 'login']);
      }
    });
  }
}
