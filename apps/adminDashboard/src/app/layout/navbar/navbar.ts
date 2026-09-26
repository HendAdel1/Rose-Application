import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  LucideLanguages,
  LucideLogOut,
  LucideMenu,
  LucideMoon,
  LucideSun,
  LucideUser,
} from '@lucide/angular';
import { ThemeService } from '@org/shared-theme';
import { SharedI18nService } from '@org/shared-i18n';
import { AdminProfileService } from '../../core/services/admin-profile.service';
import { AdminLayoutService } from '../services/admin-layout.service';

export interface AdminBreadcrumbItem {
  labelKey: string;
  customLabel?: string;
  link?: string | string[];
  current?: boolean;
}

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    LucideLanguages,
    LucideLogOut,
    LucideMenu,
    LucideMoon,
    LucideSun,
    LucideUser,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavbar {
  private readonly profileService = inject(AdminProfileService);
  private readonly layoutService = inject(AdminLayoutService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly elementRef = inject(ElementRef);
  private readonly i18n = inject(SharedI18nService);
  private readonly themeService = inject(ThemeService);

  readonly logoPath = '/logos/rose-logo.png';
  readonly profileMenuOpen = signal(false);

  readonly currentLanguage = this.i18n.currentLanguage;
  readonly isDark = computed(() => this.themeService.theme() === 'dark');

  /** Label for target language */
  readonly languageLabel = computed(() =>
    this.i18n.currentLanguage() === 'ar' ? 'English' : 'العربية',
  );

  /** Short language code indicator */
  readonly languageShortCode = computed(() =>
    this.i18n.currentLanguage() === 'ar' ? 'EN' : 'عربي',
  );

  readonly userDisplayName = this.profileService.userDisplayName;
  readonly userPhoto = this.profileService.userPhoto;
  readonly avatarInitial = this.profileService.avatarInitial;
  readonly avatarColors = this.profileService.avatarColors;

  readonly sidebarOpen = this.layoutService.sidebarOpen;
  readonly customTitle = this.layoutService.customTitle;

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

    if (url.includes('/products/add')) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.PRODUCTS', link: '/adminDashboard/products' },
        { labelKey: 'ADMIN_PRODUCTS.ADD_BREADCRUMB', current: true },
      ];
    }

    if (/\/products\/[^/]+\/edit/.test(url)) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.PRODUCTS', link: '/adminDashboard/products' },
        { labelKey: 'ADMIN_PRODUCTS.UPDATE_BREADCRUMB', current: true },
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
       if (url.includes('/account-settings')) {
      return [
        { labelKey: 'DASHBOARD.TITLE', link: '/adminDashboard/overview' },
        { labelKey: 'DASHBOARD.ACCOUNT', current: true },
      ];
    }

    return [{ labelKey: 'DASHBOARD.TITLE', current: true }];
  });

  /** Parent breadcrumb items for mobile row 1 */
  readonly parentCrumbs = computed(() => {
    const list = this.breadcrumbs();
    return list.length > 1 ? list.slice(0, -1) : [];
  });

  /** Current page / product title for mobile row 2 */
  readonly currentTitle = computed(() => {
    return this.customTitle() || this.translate.instant(this.currentSectionKey());
  });

  /** Breadcrumb items for desktop horizontal nav */
  readonly desktopBreadcrumbs = computed(() => {
    const list = this.breadcrumbs();
    const custom = this.customTitle();
    if (!custom || list.length === 0) {
      return list;
    }
    return list.map((crumb, idx) => {
      if (idx === list.length - 1) {
        return { ...crumb, customLabel: custom };
      }
      return crumb;
    });
  });

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.layoutService.closeSidebar();
        this.closeProfileMenu();
      });
  }

  toggleSidebar(event?: Event): void {
    event?.stopPropagation();
    this.layoutService.toggleSidebar();
  }

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

  toggleLanguage(): void {
    this.i18n.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.closeProfileMenu();
    this.profileService.logout();
  }
}
