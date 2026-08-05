import { Component, computed, input, output } from '@angular/core';
import {
  LucideCheck,
  LucideDynamicIcon,
  LucideInfo,
  LucideX,
  provideLucideIcons,
} from '@lucide/angular';

export type UiToastVariant = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'lib-ui-toast',
  imports: [LucideDynamicIcon],
  providers: [provideLucideIcons(LucideInfo, LucideCheck, LucideX)],
  templateUrl: './ui-toast.html',
})
export class UiToast {
  message = input.required<string>();
  variant = input<UiToastVariant>('success');
  visible = input<boolean>(true);
  dismissed = output<void>();

  statusIcon = computed(() => {
    switch (this.variant()) {
      case 'info':
        return 'info';
      case 'error':
        return 'x';
      default:
        return 'check';
    }
  });

  dismiss(): void {
    this.dismissed.emit();
  }
}
