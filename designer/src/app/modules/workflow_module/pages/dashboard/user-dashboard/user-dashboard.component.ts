import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBars, 
  faTimes, 
  faProjectDiagram,
  faHistory,
  faCog,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { UserNavbarComponent } from '@workflow/layout/navbar/user-navbar/user-navbar.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, UserNavbarComponent, BreadcrumbComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent {
  faBars = faBars;
  faTimes = faTimes;
  faProjectDiagram = faProjectDiagram;
  faHistory = faHistory;
  faCog = faCog;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  
  sidebarCollapsed = false;
  
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
