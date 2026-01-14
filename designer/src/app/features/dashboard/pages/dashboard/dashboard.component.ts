import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBars, 
  faTimes, 
  faCodeBranch, 
  faHome,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '@layout/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  faBars = faBars;
  faTimes = faTimes;
  faCodeBranch = faCodeBranch;
  faHome = faHome;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  
  sidebarCollapsed = false;
  
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
