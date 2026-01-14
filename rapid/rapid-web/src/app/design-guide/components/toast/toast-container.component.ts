import { Component } from '@angular/core';
import { ToastService, Toast } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  imports:[
    CommonModule,
    NgbToastModule
  ]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}

  getPositionClass(position: Toast['position']): string {
    switch (position) {
      case 'top-left': return 'top-0 start-0';
      case 'bottom-right': return 'bottom-0 end-0';
      case 'bottom-left': return 'bottom-0 start-0';
      case 'center': return 'top-50 start-50 translate-middle';
      default: return 'top-0 end-0'; // default: top-right
    }
  }
}
