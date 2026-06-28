import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-custom-heading',
  imports: [],
  templateUrl: './custom-heading.html',
  styleUrl: './custom-heading.css',
})
export class CustomHeading {
  eyebrow = input.required<string>();
  title = input.required<string>();
  align = input<'center' | 'start'>('center');

  containerClass = computed(() => {
    const alignment =
      this.align() === 'center'
        ? 'items-center text-center'
        : 'items-start text-start';

    return `flex flex-col ${alignment} font-sans select-none`;
  });
}
