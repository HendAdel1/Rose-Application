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

export interface AdminBreadcrumbItem {
  labelKey: string;
  link?: string | string[];
  current?: boolean;
}

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

  readonly currentSectionKey = computed(() => {
    const crumbs = this.breadcrumbs();
    return crumbs[crumbs.length - 1]?.labelKey ?? 'DASHBOARD.TITLE';
  });

  readonly breadcrumbs = computed<AdminBreadcrumbItem[]>(() => {
    const url = this.currentUrl();

    if (url.includes('/occasions/add')) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.OCCASIONS', link: '/adminDashboard/occasions' },
        { labelKey: 'DASHBOARDOCCASIONS.ADD_OCCASION', current: true },
      ];
    }

    if (/\/occasions\/(edit\/[^/]+|[^/]+\/edit)/.test(url)) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.OCCASIONS', link: '/adminDashboard/occasions' },
        { labelKey: 'DASHBOARDOCCASIONS.UPDATE_OCCASION_PREFIX', current: true },
      ];
    }

    if (url.includes('/categories/add')) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.CATEGORIES', link: '/adminDashboard/categories' },
        { labelKey: 'ADMIN_CATEGORIES.ADD_BREADCRUMB', current: true },
      ];
    }

    if (/\/categories\/[^/]+\/edit/.test(url)) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.CATEGORIES', link: '/adminDashboard/categories' },
        { labelKey: 'ADMIN_CATEGORIES.UPDATE_BREADCRUMB', current: true },
      ];
    }

    if (url.includes('/categories')) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.CATEGORIES', current: true },
      ];
    }

    if (url.includes('/occasions')) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.OCCASIONS', current: true },
      ];
    }

    if (url.includes('/products')) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.PRODUCTS', current: true },
      ];
    }

    if (url.includes('/overview')) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.OVERVIEW', current: true },
      ];
    }

    return [{ labelKey: 'DASHBOARD.TITLE', current: true }];
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
