import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
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
import { DashboardNavItem } from '../../core/models/nav-item.model';
import { AdminProfileService } from '../../core/services/admin-profile.service';

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
  private readonly profileService = inject(AdminProfileService);
  private readonly elementRef = inject(ElementRef);
  readonly layoutRoute = inject(ActivatedRoute);

  readonly logoPath = '/logos/rose-logo.png';
  readonly profileMenuOpen = signal(false);

  readonly userDisplayName = this.profileService.userDisplayName;
  readonly userEmail = this.profileService.userEmail;
  readonly userPhoto = this.profileService.userPhoto;
  readonly avatarInitial = this.profileService.avatarInitial;
  readonly avatarColors = this.profileService.avatarColors;

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
    this.closeProfileMenu();
    this.profileService.logout();
  }
}
