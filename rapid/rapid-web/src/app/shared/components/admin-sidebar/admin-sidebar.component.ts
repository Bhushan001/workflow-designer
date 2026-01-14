import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RouteInfo } from '../sidebar/sidebar.metadata';
import { ADMINROUTES } from './sidebar-routes.config';


@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent {
  @Output() toggleSidebarEvent = new EventEmitter();

  isCollapsed = false; // Set to true initially
  menuItems: RouteInfo[] = ADMINROUTES;

  constructor(private router: Router) { }

  onToggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebarEvent.emit(this.isCollapsed);
  }

  showSubMenu(item: RouteInfo) {
    item.showSubMenu = true;
  }

  hideSubMenu(item: RouteInfo) {
    item.showSubMenu = false;
  }

  isSubmenu(route: any): boolean {
    return route.submenu && route.submenu.length > 0;
  }

  generateDropdownId(title: string): string {
    return `dropdown-${title.replace(/\s+/g, '-').toLowerCase()}`;
  }

  generateParentId(title: string, depth: number, parentTitle?: string): string {
    if (depth > 0 && parentTitle) {
      return `#${this.generateDropdownId(parentTitle)}`;
    } else {
      return '#sidebar';
    }
  }

  getIconClass(icon: string): string {
    if (icon) {
      return `bx ${icon.replace('fa fa-', 'bxs-').replace('fa-', 'bx-')}`;
    }
    return '';
  }
}