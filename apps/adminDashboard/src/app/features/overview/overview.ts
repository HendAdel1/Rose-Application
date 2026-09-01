import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Category, LowStockProduct, OrderStatus, Payload, Revenue, Summary, TopSellingProduct } from '../../../app/core/models/admin-statistics.model';
import { Admin } from '../../core/services/admin/admin.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LucideClipboardList, LucideDollarSign, LucidePackage, LucideReceipt } from '@lucide/angular';
import { ChartModule } from 'primeng/chart';
import { OrderStatusChart } from './orders-status-chart/orderStatusChart';
import { RevenueChart } from './orders-status-chart/revenue-chart/revenueChart';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [DecimalPipe,LucidePackage,LucideReceipt,LucideClipboardList,LucideDollarSign,ChartModule,OrderStatusChart,RevenueChart,CommonModule,TranslatePipe],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview implements OnInit {
  private readonly adminService = inject(Admin);
  summaryData = signal<Summary | null>(null);
  categoriesData = signal<Category[]>([]);
  topSellingProducts = signal<TopSellingProduct[]>([]);
  lowStockProducts = signal<LowStockProduct[]>([]);
  orderStatusData = signal<OrderStatus | null>(null);
    revenueData = signal<Revenue | null>(null);

  ngOnInit(): void {
    this.getAllAdminStatistics('monthly');
  }

  getAllAdminStatistics(period: 'monthly' | 'week' = 'monthly'): void {
    this.adminService.getAllAdminStatistics(period).subscribe({
      next: (res: Payload) => {
        if (res) {
          this.summaryData.set(res.summary);
          this.categoriesData.set(res.categories||[]);
          this.orderStatusData.set(res.orderStatus||null);
          this.revenueData.set(res.revenue);
          this.topSellingProducts.set(res.topSellingProducts||[]);
          this.lowStockProducts.set(res.lowStockProducts||[]);

        }
      },
      error: (err: any) => console.error(err)
    });
  }
    onRevenuePeriodChange(period: 'monthly' | 'week'): void {
    this.getAllAdminStatistics(period);
  }
}
