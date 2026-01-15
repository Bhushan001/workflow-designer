import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faFilter, faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { UserService, User, UsersPageResponse } from '../../services/user.service';

@Component({
  selector: 'app-platform-users',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class PlatformUsersComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  // Icons
  faSearch = faSearch;
  faFilter = faFilter;
  faPlus = faPlus;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  // Data
  users: User[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Search
  searchQuery = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUsers(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe({
        next: (response) => {
          if (response.body) {
            this.users = response.body.content || [];
            this.totalElements = response.body.totalElements || 0;
            this.totalPages = response.body.totalPages || 0;
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.error = 'Failed to load users. Please try again.';
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0; // Reset to first page on new search
    this.loadUsers();
  }

  onFilter(): void {
    // TODO: Implement advanced filter functionality
    console.log('Filter clicked');
  }

  onAddUser(): void {
    this.router.navigate(['/platform/users/new']);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getEndIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  getFullName(user: User): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.lastName) {
      return user.lastName;
    }
    return user.username;
  }

  getRolesDisplay(user: User): string {
    if (!user.roles || user.roles.length === 0) {
      return '—';
    }
    return user.roles.join(', ');
  }
}