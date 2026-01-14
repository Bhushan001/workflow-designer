import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocket, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  faRocket = faRocket;
  faBars = faBars;
  faTimes = faTimes;
  
  isMenuOpen = false;
  
  constructor(private router: Router) {}
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
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
