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
  private routerSubscription?: Subscription;
  
  // Mock user data
  currentUser = {
    name: 'John Doe',
    email: 'admin@example.com',
    avatar: null
  };
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Check if user is authenticated based on current route
    // In a real app, this would check an auth service
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
  }
  
  checkAuthentication(): void {
    // For now, consider authenticated if on dashboard or designer routes
    const authRoutes = ['/dashboard', '/designer'];
    this.isAuthenticated = authRoutes.some(route => 
      this.router.url.startsWith(route)
    );
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
    // TODO: Implement logout logic
    this.closeUserDropdown();
    this.router.navigate(['/home']);
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
