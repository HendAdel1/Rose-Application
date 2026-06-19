import { Component, inject } from '@angular/core';
import { ThemeService } from '@org/shared-theme';
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome],
  selector: 'app-rose-app-entry',
  template: `<app-nx-welcome></app-nx-welcome>`,
})
export class RemoteEntry {
  constructor() {
    inject(ThemeService).init();
  }
}
