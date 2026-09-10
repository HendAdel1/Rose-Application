import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { LucideTrash2, LucideX } from '@lucide/angular';

import { ConfirmDialogVariant } from './models/confirm-dialog.model';

@Component({
  selector: 'lib-confirm-dialog',
  imports: [LucideTrash2, LucideX],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-hidden]': 'open() ? null : true',
  },
})
export class ConfirmDialog {
  open = input(false);
  entityName = input('item');
  message = input('');
  confirmLabel = input('Confirm');
  cancelLabel = input('Cancel');
  closeAriaLabel = input('Close');
  dialogAriaLabel = input('Confirmation dialog');
  loading = input(false);
  variant = input<ConfirmDialogVariant>('danger');

  confirmed = output<void>();
  cancelled = output<void>();

  readonly resolvedMessage = computed(() => {
    const custom = this.message().trim();
    if (custom) {
      return custom;
    }
    return `Are you sure you want to delete this ${this.entityName()}?`;
  });

  readonly confirmButtonClass = computed(() =>
    this.variant() === 'primary'
      ? 'confirm-dialog__btn confirm-dialog__btn--primary'
      : 'confirm-dialog__btn confirm-dialog__btn--danger',
  );

  onBackdropClick(): void {
    if (this.loading()) {
      return;
    }
    this.cancelled.emit();
  }

  onCancel(): void {
    if (this.loading()) {
      return;
    }
    this.cancelled.emit();
  }

  onConfirm(): void {
    if (this.loading()) {
      return;
    }
    this.confirmed.emit();
  }

  onPanelClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
