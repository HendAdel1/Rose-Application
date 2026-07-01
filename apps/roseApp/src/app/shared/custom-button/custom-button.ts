import {
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.css',
  encapsulation: ViewEncapsulation.None,
})
export class CustomButton {
  label = input<string>('');
  icon = input<string>('');
  iconPos = input<'left' | 'right'>('left');
  variant = input<'primary' | 'icon-only'>('icon-only');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(false);

  btnClick = output<void>();

  buttonClass = computed(() => {
    const classes: string[] = [];

    if (this.variant() === 'icon-only') {
      classes.push('btn-icon-only');
    } else {
      classes.push('btn-primary');

      if (this.fullWidth()) {
        classes.push('w-full');
      }
    }

    return classes.join(' ');
  });
}
