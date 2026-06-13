import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'lib-ui-button',
  imports: [CommonModule],
  templateUrl: './UiButton.html',
  styleUrl: './UiButton.css',
})
export class UiButton {
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  clicked = output<MouseEvent>();
  
}
