import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { OrderStatus } from '../../../core/models/admin-statistics.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-status-chart',
  imports: [ChartModule, CommonModule,TranslatePipe],
  templateUrl: './orderStatusChart.html',
  styleUrl: './orderStatusChart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatusChart {
private readonly platformId = inject(PLATFORM_ID);
  private readonly cd = inject(ChangeDetectorRef);

  // استقبال كائن orderStatus كـ Signal Input
  orderStatusData = input<OrderStatus | null>(null);

  chartData: any;
  chartOptions: any;

  constructor() {
    // التحديث التلقائي للرسم البياني عند تغير الـ Input
    effect(() => {
      const status = this.orderStatusData();
      if (status && isPlatformBrowser(this.platformId)) {
        this.initChart(status);
      }
    });
  }
  private initChart(status: OrderStatus): void {
    this.chartData = {
      labels: ['Completed', 'In progress', 'Canceled'],
      datasets: [
        {
          data: [status.completed.count, status.inProgress.count, status.canceled.count],
          backgroundColor: ['#00BC7D', '#2B7FFF', '#DC2626'],
          hoverBackgroundColor: ['#059669', '#2563EB', '#d80000'],
          borderWidth: 0
        }
      ]
    };

    this.chartOptions = {
      cutout: '72%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      }
    };

    this.cd.markForCheck();
  }
}
