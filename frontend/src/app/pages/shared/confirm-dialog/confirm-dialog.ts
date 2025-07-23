import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DialogConfig, DialogService } from '../../../core/services/dialog/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.css']
})
export class ConfirmDialog implements OnInit {
  config$: Observable<DialogConfig | null>;

  constructor(private dialogService: DialogService) {
    this.config$ = this.dialogService.dialogState$;
  }

  ngOnInit(): void {}

  onConfirm(config: DialogConfig): void {
    config.onConfirm();
    this.dialogService.close();
  }

  onCancel(): void {
    this.dialogService.close();
  }
}