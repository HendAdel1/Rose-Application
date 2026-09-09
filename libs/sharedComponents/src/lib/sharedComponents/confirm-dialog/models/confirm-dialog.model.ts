/**
 * Team usage:
 * ```html
 * <lib-confirm-dialog
 *   [open]="isOpen()"
 *   [message]="'CONFIRM_DIALOG.DELETE_MESSAGE' | translate: { entity: entityLabel }"
 *   [confirmLabel]="'CONFIRM_DIALOG.CONFIRM' | translate"
 *   [cancelLabel]="'CONFIRM_DIALOG.CANCEL' | translate"
 *   [loading]="deleting()"
 *   (confirmed)="onConfirm()"
 *   (cancelled)="onCancel()"
 * />
 * ```
 */
export type ConfirmDialogVariant = 'danger' | 'primary';

export interface ConfirmDialogConfig {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
}
