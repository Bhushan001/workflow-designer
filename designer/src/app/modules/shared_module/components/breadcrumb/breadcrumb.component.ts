import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { filter, map } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  url: string;
  isHome?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  faChevronRight = faChevronRight;
  faHome = faHome;

  breadcrumbs: BreadcrumbItem[] = [];

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumbs();
      });

    // Initialize breadcrumbs on component load
    this.breadcrumbs = this.buildBreadcrumbs();
  }

  private buildBreadcrumbs(): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    const url = this.router.url;
    
    // Skip if we're on home or root
    if (url === '/home' || url === '/') {
      return breadcrumbs;
    }
    
    // Split URL into segments
    const segments = url.split('/').filter(segment => segment !== '');
    let accumulatedPath = '';
    
    segments.forEach((segment, index) => {
      accumulatedPath += '/' + segment;
      
      // Determine label for this segment
      let label = this.getLabel(segment, null);
      
      // Special handling for 'new' segment
      if (segment === 'new') {
        const parentSegment = segments[index - 1];
        if (parentSegment === 'clients') {
          label = 'Add Client';
        } else if (parentSegment === 'users') {
          label = 'Add User';
        }
      }
      
      // First segment acts as home link (with home icon)
      const isFirstSegment = index === 0;
      
      breadcrumbs.push({
        label,
        url: accumulatedPath,
        isHome: isFirstSegment
      });
    });
    
    return breadcrumbs;
  }

  private getLabel(path: string, routeSnapshot: any): string {
    // Check for custom breadcrumb label in route data
    if (routeSnapshot && routeSnapshot.data && routeSnapshot.data['breadcrumb']) {
      return routeSnapshot.data['breadcrumb'];
    }

    // Convert path to readable label
    const labelMap: { [key: string]: string } = {
      'platform': 'Platform',
      'clients': 'Clients',
      'users': 'Users',
      'settings': 'Settings',
      'new': 'New',
      'client': 'Client',
      'user': 'User',
      'add-client': 'Add Client',
      'add-user': 'Add User',
      'workflow': 'Workflow',
      'client_module': 'Client',
      'workflow_module': 'Workflow',
      'dashboard': 'Dashboard',
      'list': 'List',
      'history': 'History',
      'designer': 'Designer',
      'login': 'Login',
      'signup': 'Sign Up'
    };

    return labelMap[path] || this.formatLabel(path);
  }

  private formatLabel(path: string): string {
    // Convert kebab-case or snake_case to Title Case
    return path
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}