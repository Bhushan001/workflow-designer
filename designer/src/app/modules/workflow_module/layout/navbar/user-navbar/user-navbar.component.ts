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
  faProjectDiagram,
  faHistory,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { AuthService } from '@shared/services/auth.service';
import { UserProfile } from '@shared/models/auth.types';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule, ClickOutsideDirective],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.scss',
})
export class UserNavbarComponent implements OnInit, OnDestroy {
  faRocket = faRocket;
  faBars = faBars;
  faTimes = faTimes;
  faSearch = faSearch;
  faUser = faUser;
  faChevronDown = faChevronDown;
  faSignOutAlt = faSignOutAlt;
  faBell = faBell;
  faProjectDiagram = faProjectDiagram;
  faHistory = faHistory;
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
      // TODO: Implement search functionality for workflows
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
    if (!this.currentUser) return 'U';
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return (this.currentUser.username || this.currentUser.email || 'U')[0].toUpperCase();
  }
}
