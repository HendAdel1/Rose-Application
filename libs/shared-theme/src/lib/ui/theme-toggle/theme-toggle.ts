import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { ThemeService } from '../../data-access/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [LucideMoon, LucideSun],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);

  protected toggleTheme(): void {
    this.themeService.toggle();
  }
}
