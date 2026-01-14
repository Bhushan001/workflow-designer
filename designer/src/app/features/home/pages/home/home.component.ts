import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faRocket, 
  faCodeBranch, 
  faGlobe, 
  faBolt,
  faCheckCircle,
  faShieldAlt,
  faChartLine,
  faUsers,
  faCog,
  faCloud,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '@layout/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  faRocket = faRocket;
  faCodeBranch = faCodeBranch;
  faGlobe = faGlobe;
  faBolt = faBolt;
  faCheckCircle = faCheckCircle;
  faShieldAlt = faShieldAlt;
  faChartLine = faChartLine;
  faUsers = faUsers;
  faCog = faCog;
  faCloud = faCloud;
  faArrowRight = faArrowRight;
  
  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
