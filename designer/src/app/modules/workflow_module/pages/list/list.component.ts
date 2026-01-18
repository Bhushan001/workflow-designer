import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faFilter, faPlus, faChevronLeft, faChevronRight, faEdit, faTrash, faTimes, faPlay } from '@fortawesome/free-solid-svg-icons';
import { WorkflowService, Workflow, WorkflowsPageResponse } from '../../services/workflow.service';
import { ToastService } from '@shared/services/toast.service';
import { extractErrorMessage } from '@shared/utils/error.utils';

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class WorkflowListComponent implements OnInit {
  private workflowService = inject(WorkflowService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // Icons
  faSearch = faSearch;
  faFilter = faFilter;
  faPlus = faPlus;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faEdit = faEdit;
  faTrash = faTrash;
  faTimes = faTimes;
  faPlay = faPlay;

  // Data
  workflows: Workflow[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Search
  searchQuery = '';

  // Delete confirmation
  workflowToDelete: Workflow | null = null;
  showDeleteModal = false;
  deleting = false;

  ngOnInit(): void {
    this.loadWorkflows();
  }

  loadWorkflows(): void {
    this.loading = true;
    this.error = null;

    this.workflowService.getWorkflows(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe({
        next: (response) => {
          this.workflows = response.content || [];
          this.totalElements = response.totalElements || 0;
          this.totalPages = response.totalPages || 0;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading workflows:', err);
          this.error = extractErrorMessage(err) || 'Failed to load workflows. Please try again.';
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0; // Reset to first page on new search
    this.loadWorkflows();
  }

  onFilter(): void {
    // TODO: Implement advanced filter functionality
    console.log('Filter clicked');
  }

  onAddWorkflow(): void {
    this.router.navigate(['/designer']);
  }

  onEdit(workflow: Workflow): void {
    this.router.navigate(['/designer'], { queryParams: { id: workflow.id } });
  }

  onDelete(workflow: Workflow): void {
    this.workflowToDelete = workflow;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.workflowToDelete) {
      return;
    }

    this.deleting = true;
    this.workflowService.deleteWorkflow(this.workflowToDelete.id).subscribe({
      next: (success) => {
        if (success) {
          this.showDeleteModal = false;
          const workflowName = this.workflowToDelete?.name || 'Workflow';
          this.workflowToDelete = null;
          this.deleting = false;
          this.toastService.showToast('success', 'Workflow Deleted', `Workflow "${workflowName}" has been deleted successfully.`);
          // Reload workflows after deletion
          this.loadWorkflows();
        } else {
          this.deleting = false;
          this.toastService.showToast('danger', 'Deletion Failed', 'Failed to delete workflow. Please try again.');
        }
      },
      error: (err) => {
        console.error('Error deleting workflow:', err);
        const errorMsg = extractErrorMessage(err) || 'Failed to delete workflow. Please try again.';
        this.error = errorMsg;
        this.toastService.showToast('danger', 'Workflow Deletion Failed', errorMsg);
        this.deleting = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.workflowToDelete = null;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadWorkflows();
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

  getNodeCount(workflow: Workflow): number {
    return workflow.nodes?.length || 0;
  }

  getEdgeCount(workflow: Workflow): number {
    return workflow.edges?.length || 0;
  }
}
