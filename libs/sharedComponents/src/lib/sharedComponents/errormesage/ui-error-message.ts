import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-ui-error-message',
  imports: [CommonModule],
  templateUrl: './ui-error-message.html',
  styleUrl: './ui-error-message.css',
})
export class UiErrorMessage {
  hide=input<boolean>(false)
}
