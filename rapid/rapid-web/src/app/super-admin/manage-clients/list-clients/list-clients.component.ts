import { Component, OnInit, TemplateRef } from '@angular/core';
import { ClientService } from '../services/client.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';
import { Client } from '../../../model/client.model';

@Component({
  selector: 'app-list-clients',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule
  ],
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.scss'
})
export class ListClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClientId: string = "";

  editForm: FormGroup;
  editMode: boolean = false;
  searchText = '';

  constructor(
    private modalService: NgbModal,
    private _clientService: ClientService,
    private toastr: ToastService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Z]+$')]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.getAllClients();
  }

  search(): void {
  }

  getAllClients() {
    this.selectedClientId = "";
    this._clientService.getAllClients().subscribe(
      (res: any) => {
        this.clients = res.body;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openCreateModal(content: TemplateRef<any>) {
    this.selectedClientId = "";
    this.editForm.reset();
    this.editMode = false;
    this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static' });
  }

  openEditModal(event: Event, client: Client, editModal: TemplateRef<any>) {
    this.selectedClientId = client.id;
    this.editMode = true;
    event.stopPropagation();
    this.editForm.patchValue(client);
    this.modalService.open(editModal, { centered: true, size: 'lg', backdrop: 'static' })
  }

  saveClient(modal: any): void {
    if (this.editForm.valid) {
      this._clientService.createClient(this.editForm.value).subscribe(
        (res) => {
          this.getAllClients();
          this.toastr.showToast('Success', `Client updated successfully.`, 'success');
          this.editForm.reset();
          modal.dismiss();
        },
        (err) => {
          console.log(err);
          this.toastr.showToast('Failed', `Client could not be updated`, 'danger');
        }
      );
    }
  }


  updateClient(modal: any): void {
    if (this.editForm.valid && this.editMode) {
      this._clientService.updateClient(this.selectedClientId, this.editForm.value).subscribe(
        (res) => {
          this.getAllClients();
          this.toastr.showToast('Success', `Client updated successfully.`, 'success');
          this.editForm.reset();
          modal.dismiss();
        },
        (err) => {
          console.log(err);
          this.toastr.showToast('Failed', `Client could not be updated`, 'danger');
        }
      );
    }
  }


  openDeleteConfirmationModal(event: Event, client: Client, modalContent: TemplateRef<any>) {
    event.stopPropagation(); // Prevent workspace selection when clicking delete

    if (!client.id) {
      console.error("Invalid client ID:", client);
      this.toastr.showToast('Error', 'Invalid Client ID.', 'danger');
      return;
    }

    // Open the modal and pass workspace data
    const modalRef = this.modalService.open(modalContent, { centered: true, size: 'sm', backdrop: 'static' });
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          if (client.id) {
            this.deleteClient(client.id);
          }
        }
      },
      () => { } // Handle dismiss
    );
  }

  deleteClient(clientId: string): void {
    this._clientService.deleteClient(clientId).subscribe(
      (res) => {
        this.getAllClients();
        this.toastr.showToast('Success', `Client deleted successfully.`, 'success');
      },
      (err) => {
        this.toastr.showToast('Failed', `Client could not be deleted`, 'danger');
      }
    );
  }
}
