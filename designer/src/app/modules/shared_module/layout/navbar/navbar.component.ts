import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faRocket, 
  faBars, 
  faTimes, 
  faSearch, 
  faUser, 
  faChevronDown,
  faCog,
  faSignOutAlt,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { AuthService } from '@shared/services/auth.service';
import { UserProfile } from '@shared/models/auth.types';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule, ClickOutsideDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  faRocket = faRocket;
  faBars = faBars;
  faTimes = faTimes;
  faSearch = faSearch;
  faUser = faUser;
  faChevronDown = faChevronDown;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faBell = faBell;
  
  isMenuOpen = false;
  isUserDropdownOpen = false;
  searchQuery = '';
  isAuthenticated = false;
  currentUser: UserProfile | null = null;
  private routerSubscription?: Subscription;
  private authSubscription?: Subscription;
  
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
    
    // Initial check
    this.checkAuthentication();
    
    // Listen to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthentication();
      });
  }
  
  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
  
  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
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
      // TODO: Implement search functionality
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
  
  getPrimaryRole(): string {
    const role = this.authService.getPrimaryRole();
    return role || 'User';
  }
  
  getDashboardRoute(): string {
    const role = this.authService.getPrimaryRole();
    if (role === 'PLATFORM_ADMIN') {
      return '/platform';
    } else if (role === 'CLIENT_ADMIN') {
      return '/client';
    } else if (role === 'CLIENT_USER') {
      return '/workflow';
    }
    return '/dashboard';
  }
  
  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.closeMenu();
    
    // Check if we're on the home page
    if (this.router.url === '/home' || this.router.url === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to home first, then scroll
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    }
  }
}
