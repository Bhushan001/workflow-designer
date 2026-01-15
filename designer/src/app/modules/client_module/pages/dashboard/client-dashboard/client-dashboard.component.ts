import { Component, OnInit, inject } from '@angular/core';
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
import { SelectedClientService } from '@shared/services/selected-client.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, ClientNavbarComponent, BreadcrumbComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss',
})
export class ClientDashboardComponent implements OnInit {
  private selectedClientService = inject(SelectedClientService);
  faBars = faBars;
  faTimes = faTimes;
  faUsers = faUsers;
  faCog = faCog;
  faHome = faHome;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  
  sidebarCollapsed = false;
  
  ngOnInit(): void {
    // Load selected client when dashboard is initialized
    this.selectedClientService.loadSelectedClient().subscribe({
      next: (client) => {
        if (client) {
          console.log('Selected client loaded:', client.name);
        }
      },
      error: (err) => {
        console.error('Failed to load selected client:', err);
      }
    });
  }
  
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
