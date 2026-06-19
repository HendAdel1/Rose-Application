import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService, ThemeToggle } from '@org/shared-theme';

@Component({
  imports: [RouterModule, ThemeToggle],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'shell';

  constructor() {
    inject(ThemeService).init();
  }
}
