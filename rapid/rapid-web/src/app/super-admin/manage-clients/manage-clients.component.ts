import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-clients',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './manage-clients.component.html',
  styleUrl: './manage-clients.component.scss'
})
export class ManageClientsComponent {

}
