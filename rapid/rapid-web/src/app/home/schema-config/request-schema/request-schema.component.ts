import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestSchema } from '../../model/request-schema.model';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';
import { RequestSchemaService } from '../services/request-schema.service';

@Component({
  selector: 'app-request-schema',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule
  ],
  templateUrl: './request-schema.component.html',
  styleUrl: './request-schema.component.scss'
})
export class RequestSchemaComponent {
  requestSchemas: RequestSchema[] = [];
  filteredRequestSchemas: RequestSchema[] = [];
  selectedRequestSchemaId: string = "";

  requestSchemaForm: FormGroup;

  page = 1;
  pageSize = 5;
  totalItems = 0;
  searchText = '';

  file: File | null = null;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastService,
    private fb: FormBuilder,
    private _requestSchemaService: RequestSchemaService
  ) {
    this.requestSchemaForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Z0-9_]+$')]],
      description: [''],
      schema: [''] // We'll handle this separately
    });
  }

  ngOnInit(): void {
    this.getAllRequestSchemas();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  openCreateModal(content: TemplateRef<any>) {
    this.requestSchemaForm.reset();
    this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static' });
  }


  search(): void {
    this.page = 1;
  }

  getAllRequestSchemas() {
    this.selectedRequestSchemaId = "";
    this._requestSchemaService.getAllRequestSchemas(this.page - 1, this.pageSize).subscribe(
      (res: any) => {
        this.requestSchemas = res.body.content;        
        this.totalItems = res.body.totalElements; 
      },
      (err) => {
        console.log(err);
      }
    );
  }

  pageChanged(event: any): void {
    this.page = event;
    this.getAllRequestSchemas();
  }

  openEditModal(event: Event, requestSchema: RequestSchema, editModal: TemplateRef<any>) {
    this.selectedRequestSchemaId = requestSchema.id;
    event.stopPropagation();
    this.requestSchemaForm.patchValue(requestSchema);
    this.modalService.open(editModal, { centered: true, size: 'lg', backdrop: 'static' })
      .result.then((result) => {
        if (result === 'save') {
          //this.saveRequestSchema(this.selectedRequestSchemaId, this.editForm.value);
        }
      }, () => { });
  }

  openDeleteConfirmationModal(event: Event, requestSchema: RequestSchema, modalContent: TemplateRef<any>) {
    event.stopPropagation(); // Prevent workspace selection when clicking delete

    if (!requestSchema.id) {
      console.error("Invalid requestSchema ID:", requestSchema);
      this.toastr.showToast('Error', 'Invalid RequestSchema ID.', 'danger');
      return;
    }

    // Open the modal and pass workspace data
    const modalRef = this.modalService.open(modalContent, { centered: true, size: 'sm', backdrop: 'static' });
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          if (requestSchema.id) {
            this._requestSchemaService.deleteRequestSchema(requestSchema.id).subscribe(
              (res)=>{
                this.getAllRequestSchemas();
                this.toastr.showToast('Success', 'Request Schema deleted successfully', 'success');
              },
              (err)=>{                
                this.toastr.showToast('Failed', err.error.message, 'danger');
              }
            );
          }
        }
      },
      () => { } // Handle dismiss
    );
  }

  onSubmit(modal: any) {
    if (this.requestSchemaForm.valid && this.file) {
      // Process your form data here (e.g., send it to an API)
      const formData = new FormData();
      formData.append('name', this.requestSchemaForm.get('name')?.value);
      formData.append('description', this.requestSchemaForm.get('description')?.value);
      formData.append('schema', this.file, this.file.name);
      this._requestSchemaService.createRequestSchema(formData).subscribe(
        (res) => {
          this.getAllRequestSchemas();
          this.toastr.showToast('Success', 'Request Schema uploaded successfully', 'success');
        },
        (err) => {
          this.toastr.showToast('Failed', 'Request Schema could not be uploaded', 'danger');
          console.log(err);
        }
      );
      // Close the modal after successful submission
      modal.close('save');
    } else {
      // Handle form validation errors if necessary
      console.log("Form is invalid");
      this.requestSchemaForm.markAllAsTouched();
    }
  }

}
