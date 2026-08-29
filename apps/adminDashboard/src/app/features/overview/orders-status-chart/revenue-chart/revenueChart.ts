import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnInit, output, PLATFORM_ID, signal } from '@angular/core';
import { Revenue } from '../../../../core/models/admin-statistics.model';
import { Admin } from '../../../../../app/core/services/admin/admin.service';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-revenue-chart',
  imports: [ChartModule, CommonModule],
  templateUrl: './revenueChart.html',
  styleUrl: './revenueChart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueChart  {
private readonly platformId = inject(PLATFORM_ID);
  private readonly cd = inject(ChangeDetectorRef);

  // Inputs & Outputs
  revenueData = input<Revenue | null>(null);
  periodChange = output<'monthly' | 'week'>();

  selectedPeriod: 'monthly' | 'week' = 'monthly';
  chartData: any;
  chartOptions: any;

  constructor() {
    effect(() => {
      const data = this.revenueData();
      if (data) {
        this.selectedPeriod = (data.period as 'monthly' | 'week') || 'monthly';
        if (isPlatformBrowser(this.platformId)) {
          this.initChart(data);
        }
      }
    });
  }

  onPeriodChange(period: 'monthly' | 'week'): void {
    if (this.selectedPeriod !== period) {
      this.selectedPeriod = period;
      this.periodChange.emit(period);
    }
  }

  private initChart(revenue: Revenue): void {
    const labels = revenue.points.map(p => p.label);
    const values = revenue.points.map(p => p.revenue);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Revenue',
          data: values,
          fill: true,
          tension: 0.4, // انحناء انسيابي مثل التصميم
          borderColor: '#E07A5F',
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(224, 122, 95, 0.2)';

            // عمل Gradient ناعم يختفي للأسفل
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(224, 122, 95, 0.35)');
            gradient.addColorStop(1, 'rgba(224, 122, 95, 0.0)');
            return gradient;
          },
          pointBackgroundColor: '#E07A5F',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: '#1E293B',
          padding: 10,
          displayColors: false,
          callbacks: {
            label: (context: any) => `${context.parsed.y} EGP`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#9CA3AF',
            font: { size: 12 }
          }
        },
        y: {
          grid: { color: '#F3F4F6' },
          ticks: {
            color: '#9CA3AF',
            font: { size: 12 }
          }
        }
      }
    };

    this.cd.markForCheck();
  }
}


