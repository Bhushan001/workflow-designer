import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  /**
   * Show a toast notification
   * @param type - Type of toast: 'success' (green), 'danger' (red), 'warning' (yellow), 'info' (blue)
   * @param title - Title of the toast
   * @param message - Message content of the toast
   */
  showToast(type: ToastType, title: string, message: string): void {
    switch (type) {
      case 'success':
        this.toastr.success(message, title);
        break;
      case 'danger':
        this.toastr.error(message, title);
        break;
      case 'warning':
        this.toastr.warning(message, title);
        break;
      case 'info':
        this.toastr.info(message, title);
        break;
      default:
        this.toastr.info(message, title);
    }
  }
}
