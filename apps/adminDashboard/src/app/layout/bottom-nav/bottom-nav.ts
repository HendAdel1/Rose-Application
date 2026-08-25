import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideCalendarHeart,
  LucideClipboardList,
  LucideLayoutGrid,
  LucidePackage,
} from '@lucide/angular';

interface BottomNavItem {
  labelKey: string;
  route: string;
  icon: 'overview' | 'categories' | 'occasions' | 'products';
  exact?: boolean;
}

@Component({
  selector: 'app-admin-bottom-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LucideCalendarHeart,
    LucideClipboardList,
    LucideLayoutGrid,
    LucidePackage,
  ],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBottomNav {
  readonly leftNavItems: BottomNavItem[] = [
    { labelKey: 'DASHBOARD.OVERVIEW', route: '/adminDashboard/overview', icon: 'overview', exact: true },
    { labelKey: 'DASHBOARD.CATEGORIES', route: '/adminDashboard/categories', icon: 'categories' },
  ];

  readonly rightNavItems: BottomNavItem[] = [
    { labelKey: 'DASHBOARD.OCCASIONS', route: '/adminDashboard/occasions', icon: 'occasions' },
    { labelKey: 'DASHBOARD.PRODUCTS', route: '/adminDashboard/products', icon: 'products' },
  ];
}
