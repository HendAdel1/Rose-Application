import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideLoader2, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-delete-occasion-dialog',
  standalone: true,
  imports: [
    TranslatePipe,
    LucideLoader2,
    LucideTrash2,
  ],
  templateUrl: './delete-occasion-dialog.html',
  styleUrl: './delete-occasion-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteOccasionDialog {
  readonly isOpen = input<boolean>(false);
  readonly occasionTitle = input<string>('');
  readonly isDeleting = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    if (!this.isDeleting()) {
      this.confirmed.emit();
    }
  }

  onCancel(): void {
    if (!this.isDeleting()) {
      this.cancelled.emit();
    }
  }
}
