import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SidebarSettings } from './components/sidebar-settings/sidebar-settings';
import { ProfileSettings } from './components/profile-settings/profile-settings';
import { ChangePassword } from './components/change-password/change-password';

@Component({
  selector: 'app-settings',
  imports: [SidebarSettings, ProfileSettings, ChangePassword, TranslatePipe],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  readonly activeTab = signal<'profile' | 'change-password'>('profile');
}
