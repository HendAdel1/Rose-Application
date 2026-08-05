import { Component, inject, model, output } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideLogOut,
  LucideLock,
  LucideUserRoundKey,
} from '@lucide/angular';
import { AuthSessionService } from '@org/auth-data-access';
import { TranslatePipe } from '@ngx-translate/core';

type SettingsTab = 'profile' | 'change-password';

interface SidebarNavItem {
  readonly id: SettingsTab;
  readonly labelKey: string;
  readonly icon: 'profile' | 'password';
}

@Component({
  selector: 'app-sidebar-settings',
  imports: [
    LucideLogOut,
    LucideLock,
    LucideUserRoundKey,
    TranslatePipe,
  ],
  templateUrl: './sidebar-settings.html',
  styleUrl: './sidebar-settings.css',
})
export class SidebarSettings {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  readonly activeTab = model<SettingsTab>('profile');
  readonly tabChanged = output<SettingsTab>();

  readonly navItems: readonly SidebarNavItem[] = [
    { id: 'profile', labelKey: 'SETTINGS.SIDEBAR.PROFILE', icon: 'profile' },
    { id: 'change-password', labelKey: 'SETTINGS.SIDEBAR.CHANGE_PASSWORD', icon: 'password' },
  ];

  selectTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
    this.tabChanged.emit(tab);
  }

  logout(): void {
    this.authSession.logout();
    void this.router.navigate(['/roseApp']);
  }
}
