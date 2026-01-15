import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBars, 
  faTimes, 
  faBuilding,
  faUsers,
  faCog,
  faHome,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { PlatformNavbarComponent } from '@platform/layout/navbar/platform-navbar/platform-navbar.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-platform-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, PlatformNavbarComponent, BreadcrumbComponent],
  templateUrl: './platform-dashboard.component.html',
  styleUrl: './platform-dashboard.component.scss',
})
export class PlatformDashboardComponent {
  faBars = faBars;
  faTimes = faTimes;
  faBuilding = faBuilding;
  faUsers = faUsers;
  faCog = faCog;
  faHome = faHome;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  
  sidebarCollapsed = false;
  
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
