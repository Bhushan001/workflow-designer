import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faFilter, faPlus, faChevronLeft, faChevronRight, faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserService, User, UsersPageResponse } from '@platform/services/user.service';
import { ToastService } from '@shared/services/toast.service';
import { extractErrorMessage } from '@shared/utils/error.utils';
import { SelectedClientService } from '@shared/services/selected-client.service';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-client-users',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class ClientUsersComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private selectedClientService = inject(SelectedClientService);
  private authService = inject(AuthService);

  // Icons
  faSearch = faSearch;
  faFilter = faFilter;
  faPlus = faPlus;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faEdit = faEdit;
  faTrash = faTrash;
  faTimes = faTimes;

  // Data
  users: User[] = [];
  loading = false;
  error: string | null = null;
  clientId: string | null = null;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Search
  searchQuery = '';

  // Delete confirmation
  userToDelete: User | null = null;
  showDeleteModal = false;
  deleting = false;

  ngOnInit(): void {
    // Get clientId from selected client or user profile
    const selectedClient = this.selectedClientService.getSelectedClient();
    if (selectedClient) {
      this.clientId = selectedClient.id;
      this.loadUsers();
    } else {
      // Try to get from user profile
      const user = this.authService.getCurrentUser();
      if (user?.clientId) {
        this.clientId = user.clientId;
        // Load client details first, then users
        this.selectedClientService.loadSelectedClient().subscribe({
          next: () => {
            this.loadUsers();
          },
          error: () => {
            this.error = 'Failed to load client information.';
          }
        });
      } else {
        this.error = 'Client information not available.';
      }
    }
  }

  loadUsers(): void {
    if (!this.clientId) {
      this.error = 'Client ID is required to load users.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.userService.getUsersByClientId(this.clientId, this.currentPage, this.pageSize, this.searchQuery)
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
          this.error = extractErrorMessage(err) || 'Failed to load users. Please try again.';
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
    this.router.navigate(['/client/users/new']);
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

  onEdit(user: User): void {
    this.router.navigate(['/client/users/edit', user.id]);
  }

  onDelete(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.userToDelete) {
      return;
    }

    this.deleting = true;
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        const userName = this.userToDelete ? (this.getFullName(this.userToDelete) || this.userToDelete.username || 'User') : 'User';
        this.userToDelete = null;
        this.deleting = false;
        this.toastService.showToast('success', 'User Deleted', `User "${userName}" has been deleted successfully.`);
        // Reload users after deletion
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        const errorMsg = extractErrorMessage(err) || 'Failed to delete user. Please try again.';
        this.error = errorMsg;
        this.toastService.showToast('danger', 'User Deletion Failed', errorMsg);
        this.deleting = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }
}
