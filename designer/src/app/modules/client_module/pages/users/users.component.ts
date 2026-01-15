import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Manage Users (Client)</h1>
      <p>This page will display users for your client and allow client admins to manage them.</p>
      <!-- TODO: Implement client user management functionality -->
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
    h1 {
      margin-bottom: 20px;
    }
  `]
})
export class ClientUsersComponent {}
