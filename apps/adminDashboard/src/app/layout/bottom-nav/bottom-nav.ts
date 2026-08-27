import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideCalendarHeart,
  LucideClipboardList,
  LucideLayoutGrid,
  LucidePackage,
} from '@lucide/angular';
import { BottomNavItem } from '../../core/models/nav-item.model';

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
  readonly layoutRoute = inject(ActivatedRoute);

  readonly leftNavItems: BottomNavItem[] = [
    { labelKey: 'DASHBOARD.OVERVIEW', route: ['overview'], icon: 'overview', exact: true },
    { labelKey: 'DASHBOARD.CATEGORIES', route: ['categories'], icon: 'categories' },
  ];

  readonly rightNavItems: BottomNavItem[] = [
    { labelKey: 'DASHBOARD.OCCASIONS', route: ['occasions'], icon: 'occasions' },
    { labelKey: 'DASHBOARD.PRODUCTS', route: ['products'], icon: 'products' },
  ];
}
