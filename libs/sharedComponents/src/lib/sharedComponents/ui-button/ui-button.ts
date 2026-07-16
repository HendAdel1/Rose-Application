import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideLoader } from '@lucide/angular';

export type UiButtonVariant = 'primary' | 'verify';

@Component({
  selector: 'lib-ui-button',
  imports: [CommonModule, LucideLoader],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
})
export class UiButton {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<UiButtonVariant>('primary');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  clicked = output<MouseEvent>();

  readonly buttonClasses = computed(() => {
    const base =
      'w-full font-mulish bg-maroon-600 hover:bg-maroon-700 text-white font-medium py-2.5 px-4 ' +
      'cursor-pointer rounded-lg transition-colors duration-200 shadow-sm ' +
      'flex items-center justify-center gap-2 ' +
      'dark:bg-soft-pink-300 dark:hover:bg-soft-pink-400 dark:text-zinc-800';

    const spacing = this.variant() === 'primary' ? ' my-4' : '';

    const disabledState =
      this.variant() === 'verify'
        ? ' disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-100 dark:disabled:bg-zinc-600 dark:disabled:text-zinc-400'
        : ' disabled:opacity-60 disabled:cursor-not-allowed';

    return base + spacing + disabledState;
  });
}
