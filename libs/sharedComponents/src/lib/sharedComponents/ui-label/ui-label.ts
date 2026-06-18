import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-ui-label',
  imports: [CommonModule],
  templateUrl: './ui-label.html',
  styleUrl: './ui-label.css',
})
export class UiLabel {
  forId = input<string>('');
}
