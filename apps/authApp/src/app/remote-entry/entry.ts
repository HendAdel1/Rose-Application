import { Component, inject } from '@angular/core';
import { ThemeService } from '@org/shared-theme';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-authApp-entry',
  template: `<router-outlet></router-outlet>`,
})
export class RemoteEntry {
  constructor() {
    inject(ThemeService).init();
  }
}
