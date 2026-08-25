import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@org/shared-theme';
import { SharedI18nService } from '@org/shared-i18n';
import { AdminNavbar } from '../navbar/navbar';
import { AdminSidebar } from '../sidebar/sidebar';
import { AdminBottomNav } from '../bottom-nav/bottom-nav';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AdminNavbar,
    AdminSidebar,
    AdminBottomNav,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  private readonly i18n = inject(SharedI18nService);
  private readonly themeService = inject(ThemeService);

  constructor() {
    this.themeService.init();
  }
}
