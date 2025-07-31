import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface Toast { 
  message: string; 
  type: ToastType; 
  duration?: number; // Optional custom duration
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastState = new BehaviorSubject<Toast | null>(null);
  toastState$ = this.toastState.asObservable();

  show(message: string, type: ToastType = 'success', duration?: number) {
    // Calculate duration based on message length for better UX
    const defaultDuration = Math.max(4000, Math.min(8000, message.length * 50));
    this.toastState.next({ 
      message, 
      type, 
      duration: duration || defaultDuration 
    });
  }
}