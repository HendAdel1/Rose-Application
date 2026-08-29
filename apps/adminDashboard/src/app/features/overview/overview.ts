import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Category, OrderStatus, Revenue, Summary } from '../../../app/core/models/admin-statistics.model';
import { Admin } from '../../core/services/admin/admin.service';
import { DecimalPipe } from '@angular/common';
import { LucideClipboardList, LucideDollarSign, LucidePackage, LucideReceipt } from '@lucide/angular';
import { ChartModule } from 'primeng/chart';
import { OrderStatusChart } from './orders-status-chart/orderStatusChart';
import { RevenueChart } from './orders-status-chart/revenue-chart/revenueChart';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [DecimalPipe,LucidePackage,LucideReceipt,LucideClipboardList,LucideDollarSign,ChartModule,OrderStatusChart,RevenueChart],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview implements OnInit {
  private readonly adminService = inject(Admin);
  summaryData = signal<Summary | null>(null);
  categoriesData = signal<Category[]>([]);
  orderStatusData = signal<OrderStatus | null>(null);
    revenueData = signal<Revenue | null>(null);

  ngOnInit(): void {
    this.getAllAdminStatistics('monthly');
  }

  getAllAdminStatistics(period: 'monthly' | 'week' = 'monthly'): void {
    this.adminService.getAllAdminStatistics().subscribe({
      next: (res: any) => {
        if (res?.payload) {
          this.summaryData.set(res.payload.summary);
          this.categoriesData.set(res.payload.categories||[]);
          this.orderStatusData.set(res.payload.orderStatus||null);
          this.revenueData.set(res.revenue);

        }
      },
      error: (err: any) => console.error(err)
    });
  }
    onRevenuePeriodChange(period: 'monthly' | 'week'): void {
    this.getAllAdminStatistics(period);
  }
}
