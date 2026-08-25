import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideCalendarHeart,
  LucideClipboardList,
  LucideLayoutGrid,
  LucideLogOut,
  LucideMoreVertical,
  LucidePackage,
  LucideUser,
} from '@lucide/angular';
import { AuthSessionService } from '@org/auth-data-access';
import { getAvatarColor, getUserInitial } from '../../core/utils/avatar-color.util';

interface DashboardNavItem {
  labelKey: string;
  route: string[];
  icon: 'overview' | 'categories' | 'occasions' | 'products';
  exact?: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LucideCalendarHeart,
    LucideClipboardList,
    LucideLayoutGrid,
    LucideLogOut,
    LucideMoreVertical,
    LucidePackage,
    LucideUser,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebar {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  readonly layoutRoute = inject(ActivatedRoute);

  readonly logoPath = '/logos/rose-logo.png';
  readonly profileMenuOpen = signal(false);

  readonly currentUser = this.authSession.currentUser;

  readonly userDisplayName = computed(() => {
    const user = this.currentUser();
    if (!user) return 'Admin User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName ?? user.username ?? 'Admin User';
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

  readonly navItems: DashboardNavItem[] = [
    { labelKey: 'DASHBOARD.OVERVIEW', route: ['overview'], icon: 'overview', exact: true },
    { labelKey: 'DASHBOARD.CATEGORIES', route: ['categories'], icon: 'categories' },
    { labelKey: 'DASHBOARD.OCCASIONS', route: ['occasions'], icon: 'occasions' },
    { labelKey: 'DASHBOARD.PRODUCTS', route: ['products'], icon: 'products' },
  ];

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
