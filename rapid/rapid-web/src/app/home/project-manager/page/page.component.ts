import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Page } from '../../model/page.model';
import { ToastService } from '../../../services/toast.service';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent implements OnInit {
  pages: any[] = [];
  @Input() selectedPage: any;
  @Input() selectedProject: any;
  @Output() selectPage = new EventEmitter<any>();

  @ViewChild('addPageModal') addPageModal!: TemplateRef<any>;
  selectedPageId: string | null = null; // Store selected page ID
  addPageForm: FormGroup;
  editingPage: Page | null = null; // Track Page being edited

  page = 1;
  pageSize = 5;
  totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastService,
    private _pageService: PageService
  ) {
    this.addPageForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    if(this.selectedProject) {
      this.getAllPagesByProjectId(this.selectedProject.id);  
    } else {
      this.pages = [];
    }
    if (!this.selectedPage) {
      this.selectedPageId = null;
    }
    
  }

  pageChanged(event: any): void {
    this.page = event;
    if(this.selectedProject) {
      this.getAllPagesByProjectId(this.selectedProject.id);  
    }
  }


  getAllPagesByProjectId(projectId: string) {
    this._pageService.getPagesByProjectId(projectId, this.page - 1, this.pageSize).subscribe(
      (res: any) => {
        this.pages = res.body.content;
        this.totalItems = res.body.totalElements;     
      }
    );
  }

  onPageSelect(page: any) {
    this.selectedPageId = page.id;
    this.selectPage.emit(page);
  }

  openAddPageModal() {
    this.editingPage = null; // Reset for new page creation
    this.addPageForm.reset();
    this.modalService.open(this.addPageModal, { centered: true, backdrop: 'static', size: 'lg' });
  }

  onPageSubmit() {
    if (this.addPageForm.valid) {
      const page: Page = {
        name: this.addPageForm.value.name,
        description: this.addPageForm.value.description
      };

      if (this.editingPage) {
        if (!this.editingPage.id) {
          console.error("Invalid page ID:", this.editingPage);
          this.toastr.showToast('Error', 'Invalid page ID.', 'danger');
          return;
        }
        this.updatePage(this.editingPage.id, page);
      } else {
        this.createPage(page);
      }
      this.addPageForm.reset();
      this.modalService.dismissAll();
    } else {
      console.log('Form is not valid');
    }
  }

  openEditPageModal(event: Event, page: Page): void {
    event.stopPropagation();
    this.editingPage = page; // Store selected page for editing
    this.addPageForm.patchValue({
      name: page.name,
      description: page.description
    });
    this.modalService.open(this.addPageModal, { centered: true, backdrop: 'static', size: 'lg' });
  }

  createPage(page: Page) {
    this._pageService.createPage(this.selectedProject.id, page).subscribe(
      (res) => {
        this.getAllPagesByProjectId(this.selectedProject.id); // Refresh page list
        this.toastr.showToast('Success', `Page created successfully.`, 'success');
      },
      () => {
        this.toastr.showToast('Failed', `Page could not be created`, 'danger');
      }
    );
  }

  updatePage(pageId: any, page: Page) {
    this._pageService.updatePage(this.selectedProject.id, pageId, page).subscribe(
      (res) => {
        this.getAllPagesByProjectId(this.selectedProject.id); // Refresh page list
        this.toastr.showToast('Success', `Page updated successfully.`, 'success');
      },
      () => {
        this.toastr.showToast('Failed', `Page could not be updated`, 'danger');
      }
    );
  }

  openDeleteConfirmationModal(event: Event, page: Page, modalContent: TemplateRef<any>) {
    event.stopPropagation(); // Prevent page selection when clicking delete

    if (!page.id) {
      console.error("Invalid page ID:", page);
      this.toastr.showToast('Error', 'Invalid page ID.', 'danger');
      return;
    }

    // Open the modal and pass page data
    const modalRef = this.modalService.open(modalContent, { centered: true, size: 'sm', backdrop: 'static' });
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          if (page.id) {
            this.deletePage(page.id);
          }
        }
      },
      () => { } // Handle dismiss
    );
  }

  deletePage(pageId: string): void {
    if (!pageId) {
      this.toastr.showToast('Error', 'Page ID is missing.', 'danger');
      return;
    }

    this._pageService.deletePage(this.selectedProject.id, pageId).subscribe(
      () => {
        this.toastr.showToast('Success', `Page deleted successfully.`, 'success');
        this.getAllPagesByProjectId(this.selectedProject.id); // Refresh page list
      },
      () => {
        this.toastr.showToast('Failed', `Page could not be deleted`, 'danger');
      }
    );
  }

  viewPageDetails(event: Event, page: Page): void {
    event.stopPropagation(); // Prevents page selection when clicking view
    console.log("Viewing page details:", page);
    // You can navigate to a detailed view or show a modal with page details
  }

}
