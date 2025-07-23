import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToastService, Toast as ToastModel } from '../../../core/services/toast/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css'],
  animations: [
    trigger('toastAnimation', [
      state('void', style({
        transform: 'translateY(-100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ])
  ]
})
export class Toast implements OnInit, OnDestroy {
  currentToast: ToastModel | null = null;
  private toastSubscription!: Subscription;
  private timeoutId?: number;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toastState$.subscribe(toast => {
      this.currentToast = toast;
      if (toast) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = window.setTimeout(() => {
          this.currentToast = null;
        }, 3000); // Toast disappears after 3 seconds
      }
    });
  }

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }
  }
  
  getIconClass(type: string): string {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-times-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': return 'fa-info-circle';
        default: return '';
    }
  }
  
  getBackgroundColorClass(type: string): string {
    switch (type) {
        case 'success': return 'bg-green-500';
        case 'error': return 'bg-red-500';
        case 'warning': return 'bg-yellow-500';
        case 'info': return 'bg-blue-500';
        default: return 'bg-gray-800';
    }
  }
}