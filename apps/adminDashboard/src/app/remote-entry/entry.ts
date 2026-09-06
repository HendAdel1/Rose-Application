import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@org/shared-theme';

@Component({
  imports: [RouterOutlet],
  selector: 'app-admin-dashboard-entry',
  template: `<router-outlet></router-outlet>`,
})
export class RemoteEntry {
  constructor() {
    inject(ThemeService).init();
  }
}
