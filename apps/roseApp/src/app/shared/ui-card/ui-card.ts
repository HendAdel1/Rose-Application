import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
@Component({
  selector: 'app-ui-card',
  imports: [CommonModule],
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.css',
})
export class UiCard {
imageAspect=input<string>('aspect-square')


}
