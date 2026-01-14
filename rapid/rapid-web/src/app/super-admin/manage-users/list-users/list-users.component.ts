import { Component, OnInit, TemplateRef } from '@angular/core';
import { User } from '../../../model/user.model';
import { AdminService } from '../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ROLE } from '../../constants/role.constants';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-list-users',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule
  ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit {
  users: User[] = [];
  selectedUserId: string = "";

  userForm: FormGroup;
  editMode: boolean = false;

  searchText = '';

  page = 1;
  pageSize = 5;
  totalItems = 0;


  loading = false; // Add loading flag

  constructor(
    private _adminService: AdminService,
    private modalService: NgbModal,
    private toastr: ToastService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Z]+$')]],
      description: ['']
    });
  }

  openCreateModal(content: TemplateRef<any>) {
    this.selectedUserId = "";
    this.userForm.reset();
    this.editMode = false;
    this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static' });
  }

  openEditModal(event: Event, user: User, editModal: TemplateRef<any>) {
    this.selectedUserId = user.userId;
    this.editMode = true;
    event.stopPropagation();
    this.userForm.patchValue(user);
    this.modalService.open(editModal, { centered: true, size: 'lg', backdrop: 'static' })
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  search(): void {
    this.page = 1;
  }

  getAllUsers() {
    this.loading = true; // Set loading to true
    this._adminService.getUsers(this.page - 1, this.pageSize).subscribe(
      (res: any) => {
        this.users = res.body.content;
        this.totalItems = res.body.totalElements;
        this.loading = false; // Set loading to false after data is loaded
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.loading = false; // Set loading to false on error
      }
    );
  }

  pageChanged(newPage: number) {
    this.page = newPage;
    this.getAllUsers();
  }

  getRole(roles: string[] | undefined): string {
    if (roles && roles.length > 0) {
      return ROLE[roles[0] as keyof typeof ROLE] || 'NA'; // Type assertion
    } else {
      return 'NA';
    }
  }

  saveUser(modal: any): void {
    // if (this.editForm.valid) {
    //   this._clientService.createClient(this.editForm.value).subscribe(
    //     (res) => {
    //       this.getAllClients();
    //       this.toastr.showToast('Success', `Client updated successfully.`, 'success');
    //       this.editForm.reset();
    //       modal.dismiss();
    //     },
    //     (err) => {
    //       console.log(err);
    //       this.toastr.showToast('Failed', `Client could not be updated`, 'danger');
    //     }
    //   );
    // }
  }


  updateUser(modal: any): void {
    // if (this.editForm.valid && this.editMode) {
    //   this._clientService.updateClient(this.selectedClientId, this.editForm.value).subscribe(
    //     (res) => {
    //       this.getAllClients();
    //       this.toastr.showToast('Success', `Client updated successfully.`, 'success');
    //       this.editForm.reset();
    //       modal.dismiss();
    //     },
    //     (err) => {
    //       console.log(err);
    //       this.toastr.showToast('Failed', `Client could not be updated`, 'danger');
    //     }
    //   );
    // }
  }

  openDeleteConfirmationModal(event: Event, user: User, modalContent: TemplateRef<any>) {
    event.stopPropagation(); // Prevent workspace selection when clicking delete

    if (!user.userId) {
      console.error("Invalid client ID:", user);
      this.toastr.showToast('Error', 'Invalid Client ID.', 'danger');
      return;
    }

    // Open the modal and pass workspace data
    const modalRef = this.modalService.open(modalContent, { centered: true, size: 'sm', backdrop: 'static' });
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          if (user.userId) {
            this.deleteClient(user.userId);
          }
        }
      },
      () => { } // Handle dismiss
    );
  }

  deleteClient(userId: string): void {
    console.log(userId);
    
    // this._clientService.deleteClient(clientId).subscribe(
    //   (res) => {
    //     this.getAllClients();
    //     this.toastr.showToast('Success', `Client deleted successfully.`, 'success');
    //   },
    //   (err) => {
    //     this.toastr.showToast('Failed', `Client could not be deleted`, 'danger');
    //   }
    // );
  }

}
