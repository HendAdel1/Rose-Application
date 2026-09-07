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
import { LucideLogOut, LucideMenu, LucideUser } from '@lucide/angular';
import { AdminProfileService } from '../../core/services/admin-profile.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    LucideLogOut,
    LucideMenu,
    LucideUser,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavbar {
  private readonly profileService = inject(AdminProfileService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  readonly logoPath = '/logos/rose-logo.png';
  readonly profileMenuOpen = signal(false);

  readonly userDisplayName = this.profileService.userDisplayName;
  readonly userPhoto = this.profileService.userPhoto;
  readonly avatarInitial = this.profileService.avatarInitial;
  readonly avatarColors = this.profileService.avatarColors;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects || e.url),
    ),
    { initialValue: this.router.url },
  );

  readonly currentBreadcrumbs = computed(() => {
    const url = this.currentUrl();
    if (url.includes('/occasions/add')) {
      return [
        { labelKey: 'DASHBOARD.OCCASIONS', route: '/adminDashboard/occasions' },
        { labelKey: 'DASHBOARDOCCASIONS.ADD_OCCASION', route: null },
      ];
    }
    if (url.includes('/occasions/edit')) {
      return [
        { labelKey: 'DASHBOARD.OCCASIONS', route: '/adminDashboard/occasions' },
        { labelKey: 'DASHBOARDOCCASIONS.UPDATE_OCCASION_PREFIX', route: null },
      ];
    }
    if (url.includes('/occasions')) {
      return [{ labelKey: 'DASHBOARD.OCCASIONS', route: null }];
    }
    if (url.includes('/categories')) {
      return [{ labelKey: 'DASHBOARD.CATEGORIES', route: null }];
    }
    if (url.includes('/products')) {
      return [{ labelKey: 'DASHBOARD.PRODUCTS', route: null }];
    }
    if (url.includes('/overview')) {
      return [{ labelKey: 'DASHBOARD.OVERVIEW', route: null }];
    }
    return [];
  });

  readonly currentSectionKey = computed(() => {
    const url = this.currentUrl();
    if (url.includes('/products')) return 'DASHBOARD.PRODUCTS';
    if (url.includes('/categories')) return 'DASHBOARD.CATEGORIES';
    if (url.includes('/occasions')) return 'DASHBOARD.OCCASIONS';
    if (url.includes('/overview')) return 'DASHBOARD.OVERVIEW';
    return null;
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
    this.closeProfileMenu();
    this.profileService.logout();
  }
}
