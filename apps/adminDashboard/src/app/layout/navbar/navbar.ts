import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideLogOut,
  LucideMoon,
  LucideSun,
  LucideUser,
} from '@lucide/angular';
import { AuthSessionService } from '@org/auth-data-access';
import { SharedI18nService } from '@org/shared-i18n';
import { ThemeService } from '@org/shared-theme';
import { getAvatarColor, getUserInitial } from '../../core/utils/avatar-color.util';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    LucideLogOut,
    LucideMoon,
    LucideSun,
    LucideUser,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavbar {
  private readonly authSession = inject(AuthSessionService);
  private readonly i18n = inject(SharedI18nService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  readonly logoPath = '/logos/rose-logo.png';
  readonly profileMenuOpen = signal(false);

  readonly currentUser = this.authSession.currentUser;
  readonly isDark = computed(() => this.themeService.theme() === 'dark');

  readonly languageLabel = computed(() =>
    this.i18n.currentLanguage() === 'ar' ? 'English' : 'العربية',
  );

  readonly userDisplayName = computed(() => {
    const user = this.currentUser();
    if (!user) return 'Admin';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName ?? user.username ?? 'Admin';
  });

  readonly userEmail = computed(() => {
    const user = this.currentUser();
    return user?.email ?? 'admin@rose.com';
  });

  readonly userPhoto = computed(() => {
    const user = this.currentUser() as { photo?: string; avatar?: string } | null;
    return user?.photo ?? user?.avatar ?? null;
  });

  readonly avatarInitial = computed(() => {
    const user = this.currentUser();
    return getUserInitial(user?.firstName || user?.username, user?.email);
  });

  readonly avatarColors = computed(() => {
    const user = this.currentUser();
    const identifier = user?.email || user?.username || user?.firstName || 'admin';
    return getAvatarColor(identifier);
  });

  toggleProfileMenu(event?: Event): void {
    event?.stopPropagation();
    this.profileMenuOpen.update((open) => !open);
  }

  closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLanguage(): void {
    this.i18n.toggleLanguage();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeProfileMenu();
    }
  }

  logout(): void {
    this.authSession.logout();
    this.closeProfileMenu();
    void this.router.navigate(['/roseApp']);
  }
}
