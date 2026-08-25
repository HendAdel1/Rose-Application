import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideClipboardList,
  LucidePackage,
  LucideReceipt,
  LucideTrendingUp,
} from '@lucide/angular';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [
    TranslatePipe,
    LucideClipboardList,
    LucidePackage,
    LucideReceipt,
    LucideTrendingUp,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  readonly stats = [
    {
      titleKey: 'DASHBOARD.TOTAL_PRODUCTS',
      value: '12',
      icon: 'package',
      bgClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
      iconBgClass: 'bg-white text-[#8A1730] dark:bg-rose-900/50 dark:text-rose-200',
    },
    {
      titleKey: 'DASHBOARD.TOTAL_ORDERS',
      value: '1,284',
      icon: 'receipt',
      bgClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
      iconBgClass: 'bg-white text-blue-600 dark:bg-blue-900/50 dark:text-blue-200',
    },
    {
      titleKey: 'DASHBOARD.TOTAL_REVENUE',
      value: '24,500 EGP',
      icon: 'trending',
      bgClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
      iconBgClass: 'bg-white text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-200',
    },
  ];

  readonly categories = [
    { name: 'Chocolate', count: '4 Products' },
    { name: 'Flowers', count: '8 Products' },
    { name: 'Cards', count: '2 Products' },
  ];
}
