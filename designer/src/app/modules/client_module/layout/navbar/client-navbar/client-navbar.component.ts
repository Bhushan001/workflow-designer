import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faRocket, 
  faBars, 
  faTimes, 
  faSearch, 
  faUser, 
  faChevronDown,
  faSignOutAlt,
  faBell,
  faUsers,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { AuthService } from '@shared/services/auth.service';
import { UserProfile } from '@shared/models/auth.types';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule, ClickOutsideDirective],
  templateUrl: './client-navbar.component.html',
  styleUrl: './client-navbar.component.scss',
})
export class ClientNavbarComponent implements OnInit, OnDestroy {
  faRocket = faRocket;
  faBars = faBars;
  faTimes = faTimes;
  faSearch = faSearch;
  faUser = faUser;
  faChevronDown = faChevronDown;
  faSignOutAlt = faSignOutAlt;
  faBell = faBell;
  faUsers = faUsers;
  faCog = faCog;
  
  isMenuOpen = false;
  isUserDropdownOpen = false;
  searchQuery = '';
  currentUser: UserProfile | null = null;
  private authSubscription?: Subscription;
  
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  
  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
  
  closeUserDropdown(): void {
    this.isUserDropdownOpen = false;
  }
  
  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      // TODO: Implement search functionality for client admin
      console.log('Searching for:', this.searchQuery);
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.closeUserDropdown();
  }
  
  getUserDisplayName(): string {
    if (!this.currentUser) return 'User';
    return this.currentUser.firstName && this.currentUser.lastName
      ? `${this.currentUser.firstName} ${this.currentUser.lastName}`
      : this.currentUser.username || this.currentUser.email || 'User';
  }
  
  getUserInitials(): string {
    if (!this.currentUser) return 'C';
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return (this.currentUser.username || this.currentUser.email || 'C')[0].toUpperCase();
  }
}
