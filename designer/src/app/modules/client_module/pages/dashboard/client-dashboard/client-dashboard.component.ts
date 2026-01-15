import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBars, 
  faTimes, 
  faUsers,
  faCog,
  faHome,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { ClientNavbarComponent } from '@client/layout/navbar/client-navbar/client-navbar.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, ClientNavbarComponent, BreadcrumbComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss',
})
export class ClientDashboardComponent {
  faBars = faBars;
  faTimes = faTimes;
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
