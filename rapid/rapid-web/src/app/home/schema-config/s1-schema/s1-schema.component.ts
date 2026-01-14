import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { S1Schema } from '../../model/s1-schema.model';
import { ToastService } from '../../../services/toast.service';
import { S1SchemaService } from '../services/s1schema.service';
import { RequestSchemaService } from '../services/request-schema.service';
import { RequestSchema } from '../../model/request-schema.model';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-s1-schema',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgSelectModule
  ],
  templateUrl: './s1-schema.component.html',
  styleUrl: './s1-schema.component.scss'
})
export class S1SchemaComponent {
  s1Schemas: S1Schema[] = [];
  filteredS1Schemas: S1Schema[] = [];
  selectedS1SchemaId: string = "";
  requestSchemas: RequestSchema[] = [];

  s1SchemaForm: FormGroup;

  page = 1;
  pageSize = 5;
  totalItems = 0;
  searchText = '';

  file: File | null = null;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastService,
    private fb: FormBuilder,
    private _s1SchemaService: S1SchemaService,
    private _requestSchemaService: RequestSchemaService
  ) {
    this.s1SchemaForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Z0-9_]+$')]],
      description: [''],
      requestSchemaId: ['', Validators.required],
      schema: [''] // We'll handle this separately
    });
  }

  ngOnInit(): void {
    this.getAllRequestSchemas();
    this.getAllS1Schemas();
  }

  get f() {
    return this.s1SchemaForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  openCreateModal(content: TemplateRef<any>) {
    this.s1SchemaForm.reset();
    this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static' });
  }

  getAllRequestSchemas() {
    this._requestSchemaService.getAllRequestSchemaDTOs().subscribe(
      (res: any) => {
        this.requestSchemas = res.body;
      },
      (err) => {
        console.log(err);
      }
    );
  }


  search(): void {
    this.page = 1;
  }

  getAllS1Schemas() {
    this.selectedS1SchemaId = "";
    this._s1SchemaService.getAllS1Schemas().subscribe(
      (res: any) => {
        this.s1Schemas = res.body.content;        
        this.totalItems = res.body.totalElements; 
      },
      (err) => {
        console.log(err);
      }
    );
  }

  pageChanged(event: any): void {
    this.page = event;
    this.getAllS1Schemas();
  }

  openEditModal(event: Event, s1Schema: S1Schema, editModal: TemplateRef<any>) {
    this.selectedS1SchemaId = s1Schema.id;
    event.stopPropagation();
    this.s1SchemaForm.patchValue(s1Schema);
    this.modalService.open(editModal, { centered: true, size: 'lg', backdrop: 'static' })
      .result.then((result) => {
        if (result === 'save') {
          //this.saveS1Schema(this.selectedS1SchemaId, this.editForm.value);
        }
      }, () => { });
  }

  openDeleteConfirmationModal(event: Event, s1Schema: S1Schema, modalContent: TemplateRef<any>) {
    event.stopPropagation(); // Prevent workspace selection when clicking delete

    if (!s1Schema.id) {
      console.error("Invalid s1Schema ID:", s1Schema);
      this.toastr.showToast('Error', 'Invalid S1Schema ID.', 'danger');
      return;
    }

    // Open the modal and pass workspace data
    const modalRef = this.modalService.open(modalContent, { centered: true, size: 'sm', backdrop: 'static' });
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          if (s1Schema.id) {
            this._s1SchemaService.deleteS1Schema(s1Schema.id).subscribe(
              (res) => {
               // this.getAllRequestSchemas();
                this.getAllS1Schemas();
                this.toastr.showToast('Success', 'S1 Schema deleted successfully', 'success');
              },
              (err) => {
                this.toastr.showToast('Failed', 'S1 Schema could not be deleted', 'danger');
              }
            );
          }
        }
      },
      () => { } // Handle dismiss
    );
  }

  onSubmit(modal: any) {
    if (this.s1SchemaForm.valid && this.file) {
      // Process your form data here (e.g., send it to an API)
      const formData = new FormData();
      formData.append('name', this.s1SchemaForm.get('name')?.value);
      formData.append('description', this.s1SchemaForm.get('description')?.value);
      formData.append('request_schema_id', this.s1SchemaForm.get('requestSchemaId')?.value);
      formData.append('schema', this.file, this.file.name);
      this._s1SchemaService.createS1Schema(formData).subscribe(
        (res) => {
         // this.getAllRequestSchemas();
          this.getAllS1Schemas();
          this.toastr.showToast('Success', 'S1 Schema uploaded successfully', 'success');
        },
        (err) => {
          this.toastr.showToast('Failed', 'S1 Schema could not be uploaded', 'danger');
          console.log(err);
        }
      );
      // Close the modal after successful submission
      modal.close('save');
    } else {
      // Handle form validation errors if necessary
      console.log("Form is invalid");
      this.s1SchemaForm.markAllAsTouched();
    }
  }
}
