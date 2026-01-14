import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Mapping } from '../../model/mapping.model';
import { ToastService } from '../../../services/toast.service';
import { MappingService } from '../../schema-config/services/mapping.service';

@Component({
  selector: 'app-mapping-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule
  ],
  templateUrl: './mapping-list.component.html',
  styleUrl: './mapping-list.component.scss'
})
export class MappingListComponent {
  mappings: Mapping[] = [];
  selectedMappingId: string = "";

  page = 1;
  pageSize = 5;
  totalItems = 0;
  searchText = '';

  constructor(
    private modalService: NgbModal,
    private toastr: ToastService,
    private fb: FormBuilder,
    private _mappingService: MappingService
  ) {
   
  }

  ngOnInit(): void {
    this.getAllMappings();
  }

  search(): void {
    this.page = 1;
  }

  getAllMappings() {
    this.selectedMappingId = "";
    this._mappingService.getAllMappings(this.page - 1, this.pageSize).subscribe(
      (res: any) => {
        this.mappings = res.body.content;        
        this.totalItems = res.body.totalElements; 
      },
      (err) => {
        console.log(err);
      }
    );
  }

  pageChanged(event: any): void {
    this.page = event;
    this.getAllMappings();
  }


  openDeleteConfirmationModal(event: Event, mapping: Mapping, modalContent: TemplateRef<any>) {
    event.stopPropagation(); // Prevent workspace selection when clicking delete

    if (!mapping.id) {
      console.error("Invalid mapping ID:", mapping);
      this.toastr.showToast('Error', 'Invalid mapping ID.', 'danger');
      return;
    }

    // Open the modal and pass workspace data
    const modalRef = this.modalService.open(modalContent, { centered: true, size: 'sm', backdrop: 'static' });
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          if (mapping.id) {
            this._mappingService.deleteMapping(mapping.id).subscribe(
              (res)=>{
                this.getAllMappings();
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
}
