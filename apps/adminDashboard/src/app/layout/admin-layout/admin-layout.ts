import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@org/shared-theme';
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
  constructor() {
    inject(ThemeService).init();
  }
}
