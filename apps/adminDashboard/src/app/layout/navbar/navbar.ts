import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideLogOut, LucideUser } from '@lucide/angular';
import { AuthSessionService } from '@org/auth-data-access';
import { getAvatarColor, getUserInitial } from '../../core/utils/avatar-color.util';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    LucideLogOut,
    LucideUser,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavbar {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  readonly logoPath = '/logos/rose-logo.png';
  readonly profileMenuOpen = signal(false);

  readonly currentUser = this.authSession.currentUser;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects || e.url),
    ),
    { initialValue: this.router.url },
  );

  readonly currentSectionKey = computed(() => {
    const url = this.currentUrl();
    if (url.includes('/products')) return 'DASHBOARD.PRODUCTS';
    if (url.includes('/categories')) return 'DASHBOARD.CATEGORIES';
    if (url.includes('/occasions')) return 'DASHBOARD.OCCASIONS';
    if (url.includes('/overview')) return 'DASHBOARD.OVERVIEW';
    return null;
  });

  readonly userDisplayName = computed(() => {
    const user = this.currentUser();
    if (!user) return 'Admin';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName ?? user.username ?? 'Admin';
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
