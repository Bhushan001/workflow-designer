import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../../model/project.model';
import { ToastService } from '../../../services/toast.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  projects: any[] = [];
  @Input() selectedProject: any;
  @Input() selectedWorkspace: any;
  @Output() selectProject = new EventEmitter<any>();
  @ViewChild('addProjectModal') addProjectModal!: TemplateRef<any>;
  selectedProjectId: string | null = null; // Store selected project ID
  addProjectForm: FormGroup;
  editingProject: Project | null = null; // Track Project being edited


  page = 1;
  pageSize = 5;
  totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastService,
    private _projectService: ProjectService
  ) {
    this.addProjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    if (this.selectedWorkspace) {
      this.getAllProjectsByWorkspaceId(this.selectedWorkspace.id);
    } else {
      this.projects = [];
    }
    if (!this.selectedProject) {
      this.selectedProjectId = null;
    }

  }

  pageChanged(event: any): void {
    this.page = event;
    if (this.selectedWorkspace) {
      this.getAllProjectsByWorkspaceId(this.selectedWorkspace.id);
    }
  }

  getAllProjectsByWorkspaceId(workspaceId: string) {
    this._projectService.getProjectsByWorkspaceId(workspaceId, this.page - 1, this.pageSize).subscribe(
      (res: any) => {
        this.projects = res.body.content;
        this.totalItems = res.body.totalElements;
      }
    );
  }

  onProjectSelect(project: any) {
    this.selectedProjectId = project.id;
    this.selectProject.emit(project);
  }

  openAddProjectModal() {
    this.editingProject = null; // Reset for new project creation
    this.addProjectForm.reset();
    this.modalService.open(this.addProjectModal, { centered: true, backdrop: 'static', size: 'lg' });
  }

  openEditProjectModal(event: Event, project: Project): void {
    event.stopPropagation();
    this.editingProject = project; // Store selected project for editing
    this.addProjectForm.patchValue({
      name: project.name,
      description: project.description
    });
    this.modalService.open(this.addProjectModal, { centered: true, backdrop: 'static', size: 'lg' });
  }

  onSubmit() {
    if (this.addProjectForm.valid) {
      const project: Project = {
        name: this.addProjectForm.value.name,
        description: this.addProjectForm.value.description
      };

      if (this.editingProject) {
        if (!this.editingProject.id) {
          console.error("Invalid project ID:", this.editingProject);
          this.toastr.showToast('Error', 'Invalid project ID.', 'danger');
          return;
        }
        this.updateProject(this.editingProject.id, project);
      } else {
        this.createProject(project);
      }
      this.addProjectForm.reset();
      this.modalService.dismissAll();
    } else {
      console.log('Form is not valid');
    }
  }

  createProject(project: Project) {
    this._projectService.createProject(this.selectedWorkspace.id, project).subscribe(
      (res) => {
        if (this.selectedWorkspace) {
          this.getAllProjectsByWorkspaceId(this.selectedWorkspace.id);
        }
        this.toastr.showToast('Success', `Project created successfully.`, 'success');
      },
      () => {
        this.toastr.showToast('Failed', `Project could not be created`, 'danger');
      }
    );
  }

  updateProject(projectId: any, project: Project) {
    this._projectService.updateProject(this.selectedWorkspace.id, projectId, project).subscribe(
      (res) => {
        if (this.selectedWorkspace) {
          this.getAllProjectsByWorkspaceId(this.selectedWorkspace.id);
        }
        this.toastr.showToast('Success', `Project updated successfully.`, 'success');
      },
      () => {
        this.toastr.showToast('Failed', `Project could not be updated`, 'danger');
      }
    );
  }

  openDeleteConfirmationModal(event: Event, project: Project, modalContent: TemplateRef<any>) {
    event.stopPropagation(); // Prevent project selection when clicking delete

    if (!project.id) {
      console.error("Invalid project ID:", project);
      this.toastr.showToast('Error', 'Invalid project ID.', 'danger');
      return;
    }

    // Open the modal and pass project data
    const modalRef = this.modalService.open(modalContent, { centered: true, size: 'sm', backdrop: 'static' });
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          if (project.id) {
            this.deleteProject(project.id);
          }
        }
      },
      () => { } // Handle dismiss
    );
  }

  deleteProject(projectId: string): void {
    if (!projectId) {
      this.toastr.showToast('Error', 'Project ID is missing.', 'danger');
      return;
    }
    this._projectService.deleteProject(this.selectedWorkspace.id, projectId).subscribe(
      () => {
        if (this.selectedWorkspace) {
          this.getAllProjectsByWorkspaceId(this.selectedWorkspace.id);
        }
        this.toastr.showToast('Success', `Project deleted successfully.`, 'success');
      },
      () => {
        this.toastr.showToast('Failed', `Project could not be deleted`, 'danger');
      }
    );
  }

  viewProjectDetails(event: Event, project: Project): void {
    event.stopPropagation(); // Prevents project selection when clicking view
    console.log("Viewing project details:", project);
    // You can navigate to a detailed view or show a modal with project details
  }

}
