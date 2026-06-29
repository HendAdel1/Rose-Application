import { CommonModule } from '@angular/common';
import { Component, computed, input, output, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-custom-button',
  imports: [CommonModule,ButtonModule],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.css',
  encapsulation:ViewEncapsulation.None
})
export class CustomButton {
  label = input<string>('');
  icon = input<string>('');
  iconPos = input<'left' | 'right'>('left');
  variant = input<'primary' | 'icon-only'>('icon-only');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(false);

  btnClick = output<void>();

  ButtonClass = computed(() => {
    let classes = '';

    if (this.variant() === 'icon-only') {
      classes = 'btn-icon-only';
    } else {
      classes = 'btn-primary';

      if (this.fullWidth()) {
        classes += ' w-full';
      }
    }

    return classes;
  });
}
