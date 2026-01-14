// src/app/services/ngb-toast.service.ts
import { Injectable } from '@angular/core';

export interface Toast {
    header: string;
    body: string;
    classname: string;
    delay?: number;
    icon?: string;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'; // <-- THIS LINE is important
    showCloseButton?: boolean;
  }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  private toastClassMap: { [key: string]: string } = {
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-info text-white',
    error: 'bg-danger text-white',
    primary: 'bg-primary text-white'
  };

  private toastIconMap: { [key: string]: string } = {
    success: 'bx bx-check-circle',
    danger: 'bx bx-x-circle',
    warning: 'bx bx-error',
    info: 'bx bx-info-circle',
    error: 'bx bx-error-circle',
    primary: 'bx bx-star'
  };

  /**
   * Show toast with header, body, type and options
   * @param header Header text
   * @param body Toast message
   * @param type success | danger | info | warning | error | primary
   * @param delay Auto-dismiss delay (default 3000ms)
   * @param showCloseButton Whether to show close icon (default true)
   */
  showToast(header: string, body: string, type: string = 'info', delay: number = 3000, showCloseButton: boolean = true) {
    const classname = this.toastClassMap[type];
    const icon = this.toastIconMap[type];
    this.toasts.push({ header, body, classname, delay, icon, showCloseButton });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clearAll() {
    this.toasts = [];
  }
}
