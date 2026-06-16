import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideLoader}from '@lucide/angular'
@Component({
  selector: 'lib-ui-button',
  imports: [CommonModule,LucideLoader],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
})
export class UiButton {
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  clicked = output<MouseEvent>();

}
