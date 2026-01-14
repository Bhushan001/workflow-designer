import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Workspace } from '../../model/workspace.model';
import { WorkspaceService } from '../../services/workspace.service';
import { ToastService } from '../../../services/toast.service';
import { PageableResponse } from '../../model/pageable.model';

@Component({
  selector: 'app-workspace',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent {
  workspaces: any[] = [];
  @Output() selectWorkspace = new EventEmitter<any>();
  @Output() workspaceCreated = new EventEmitter<any>();
  @Output() workspaceDeleted = new EventEmitter<any>();
  @ViewChild('addWorkspaceModal') addWorkspaceModal!: TemplateRef<any>;
  selectedWorkspaceId: string | null = null; // Store selected workspace ID
  addWorkspaceForm: FormGroup;
  editingWorkspace: Workspace | null = null; // Track workspace being edited

  page = 1;
  pageSize = 5;
  totalItems = 0;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _workspaceService: WorkspaceService,
    private toastr: ToastService
  ) {
    this.addWorkspaceForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.getAllWorkspaces();
  }

  

  pageChanged(event: any): void {
    this.page = event;
    this.getAllWorkspaces();
  }


  getAllWorkspaces() {
    this._workspaceService.getWorkspaces(this.page - 1, this.pageSize).subscribe(
      (res: any) => {        
        this.workspaces = res.body.content;
        this.totalItems = res.body.totalElements;        
      }
    );
  }
  onWorkspaceSelect(workspace: any) {
    this.selectedWorkspaceId = workspace.id;     
    this.selectWorkspace.emit(workspace);
  }

  openAddWorkspaceModal() {
    this.editingWorkspace = null; // Reset for new workspace creation
    this.addWorkspaceForm.reset();
    this.modalService.open(this.addWorkspaceModal, { centered: true, backdrop: 'static', size: 'lg' });
  }

  openEditWorkspaceModal(event: Event, workspace: Workspace): void {
    event.stopPropagation();
    this.editingWorkspace = workspace; // Store selected workspace for editing
    this.addWorkspaceForm.patchValue({
      name: workspace.name,
      description: workspace.description
    });
    this.modalService.open(this.addWorkspaceModal, { centered: true, backdrop: 'static', size: 'lg' });
  }

  onSubmit() {
    if (this.addWorkspaceForm.valid) {
      const workspace: Workspace = {
        name: this.addWorkspaceForm.value.name,
        description: this.addWorkspaceForm.value.description
      };

      if (this.editingWorkspace) {
        if (!this.editingWorkspace.id) {
          console.error("Invalid workspace ID:", this.editingWorkspace);
          this.toastr.showToast('Error', 'Invalid workspace ID.', 'danger');
          return;
        }
        this.updateWorkspace(this.editingWorkspace.id, workspace);
      } else {
        this.createWorkspace(workspace);
      }
      this.addWorkspaceForm.reset();
      this.modalService.dismissAll();
    } else {
      console.log('Form is not valid');
    }
  }

  createWorkspace(workspace: Workspace) {
    this._workspaceService.createWorkspace(workspace).subscribe(
      (res) => {
        this.getAllWorkspaces();
        this.toastr.showToast('Success', `Workspace created successfully.`, 'success');
        this.workspaceCreated.emit();
      },
      () => {
        this.toastr.showToast('Failed', `Workspace could not be created`, 'danger');
      }
    );
  }

  updateWorkspace(workspaceId: any, workspace: Workspace) {
    this._workspaceService.updateWorkspace(workspaceId, workspace).subscribe(
      (res) => {
        this.toastr.showToast('Success', `Workspace updated successfully.`, 'success');
        this.getAllWorkspaces();
      },
      () => {
        this.toastr.showToast('Failed', `Workspace could not be updated`, 'danger');
      }
    );
  }

  openDeleteConfirmationModal(event: Event, workspace: Workspace, modalContent: TemplateRef<any>) {
    event.stopPropagation(); // Prevent workspace selection when clicking delete

    if (!workspace.id) {
      console.error("Invalid workspace ID:", workspace);
      this.toastr.showToast('Error', 'Invalid workspace ID.', 'danger');
      return;
    }

    // Open the modal and pass workspace data
    const modalRef = this.modalService.open(modalContent, { centered: true, size: 'sm', backdrop: 'static' });
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          if (workspace.id) {
            this.deleteWorkspace(workspace.id);
          }
        }
      },
      () => { } // Handle dismiss
    );
  }

  deleteWorkspace(workspaceId: string): void {
    if (!workspaceId) {
      this.toastr.showToast('Error', 'Workspace ID is missing.', 'danger');
      return;
    }

    this._workspaceService.deleteWorkspace(workspaceId).subscribe(
      () => {
        this.getAllWorkspaces();
        this.toastr.showToast('Success', `Workspace deleted successfully.`, 'success');
        this.workspaceDeleted.emit(); // Refresh workspace list
      },
      () => {
        this.toastr.showToast('Failed', `Workspace could not be deleted`, 'danger');
      }
    );
  }

  viewWorkspaceDetails(event: Event, workspace: Workspace): void {
    event.stopPropagation(); // Prevents workspace selection when clicking view
    console.log("Viewing workspace details:", workspace);
    // You can navigate to a detailed view or show a modal with workspace details
  }
}