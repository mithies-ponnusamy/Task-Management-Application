import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface Toast { message: string; type: ToastType; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastState = new BehaviorSubject<Toast | null>(null);
  toastState$ = this.toastState.asObservable();

  show(message: string, type: ToastType = 'success') {
    this.toastState.next({ message, type });
  }
}