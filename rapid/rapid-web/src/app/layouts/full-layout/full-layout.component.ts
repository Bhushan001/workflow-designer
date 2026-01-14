import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-full-layout',
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    RouterOutlet
  ],
  templateUrl: './full-layout.component.html',
  styleUrl: './full-layout.component.scss'
})
export class FullLayoutComponent {

  sidebarCollapsed = false;

  handleSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;    
  }
}
