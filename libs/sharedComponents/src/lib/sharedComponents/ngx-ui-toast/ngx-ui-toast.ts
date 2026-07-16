import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
  LucideCheck,
  LucideDynamicIcon,
  LucideInfo,
  LucideX,
  provideLucideIcons,
} from '@lucide/angular';
import { Toast } from 'ngx-toastr';

import type { UiToastVariant } from '../ui-toast/ui-toast';

@Component({
  selector: '[toast-component]',
  imports: [LucideDynamicIcon],
  providers: [provideLucideIcons(LucideInfo, LucideCheck, LucideX)],
  templateUrl: './ngx-ui-toast.html',
  styleUrl: './ngx-ui-toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxUiToast extends Toast {
  readonly displayText = computed(() => {
    const title = this.title();
    const message = this.message();

    if (title && message) {
      return `${title}: ${message}`;
    }

    return message || title || '';
  });

  readonly variant = computed<UiToastVariant>(() => {
    switch (this.toastPackage.toastType) {
      case 'toast-error':
        return 'error';
      case 'toast-warning':
        return 'warning';
      case 'toast-info':
        return 'info';
      default:
        return 'success';
    }
  });

  readonly statusIcon = computed(() => {
    switch (this.variant()) {
      case 'info':
        return 'info';
      case 'error':
        return 'x';
      default:
        return 'check';
    }
  });
}
