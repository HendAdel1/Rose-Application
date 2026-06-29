import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-custom-heading',
  imports: [CommonModule],
  templateUrl: './custom-heading.html',
  styleUrl: './custom-heading.css',
})
export class CustomHeading {
  text=input<string>('')
  showUnderline =input<boolean>(true)
}
