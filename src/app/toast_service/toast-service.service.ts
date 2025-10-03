import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
  template?: TemplateRef<any>;
  message?: string;
  classname?: string;
  delay?: number;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  // Success Toast
  success(message: string, delay: number = 5000) {
    this.show(message, 'success', delay);
  }

  // Error Toast
  error(message: string, delay: number = 7000) {
    this.show(message, 'error', delay);
  }

  // Warning Toast
  warning(message: string, delay: number = 5000) {
    this.show(message, 'warning', delay);
  }

  // Info Toast
  info(message: string, delay: number = 4000) {
    this.show(message, 'info', delay);
  }

  // Show Toast
  private show(message: string, type: 'success' | 'error' | 'warning' | 'info', delay: number = 5000) {
    this.toasts.push({
      message,
      type,
      delay,
      classname: this.getToastClass(type)
    });
  }

  // Remove Toast
  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  // Clear All Toasts
  clear() {
    this.toasts = [];
  }

  // Get CSS classes based on toast type
  private getToastClass(type: string): string {
    const baseClasses = 'transform transition-all duration-300 ease-in-out max-w-md';

    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border border-green-200 text-green-800 shadow-lg`;
      case 'error':
        return `${baseClasses} bg-red-50 border border-red-200 text-red-800 shadow-lg`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border border-yellow-200 text-yellow-800 shadow-lg`;
      case 'info':
        return `${baseClasses} bg-blue-50 border border-blue-200 text-blue-800 shadow-lg`;
      default:
        return `${baseClasses} bg-gray-50 border border-gray-200 text-gray-800 shadow-lg`;
    }
  }
}