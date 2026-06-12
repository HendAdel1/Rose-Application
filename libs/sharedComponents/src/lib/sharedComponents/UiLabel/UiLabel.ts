import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-ui-label',
  imports: [CommonModule],
  templateUrl: './UiLabel.html',
  styleUrl: './UiLabel.css',
})
export class UiLabel {
  forId = input<string>('');
}
