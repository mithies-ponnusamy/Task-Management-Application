import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DialogConfig {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogState = new BehaviorSubject<DialogConfig | null>(null);
  dialogState$ = this.dialogState.asObservable();

  open(config: DialogConfig) {
    this.dialogState.next(config);
  }

  close() {
    this.dialogState.next(null);
  }
}