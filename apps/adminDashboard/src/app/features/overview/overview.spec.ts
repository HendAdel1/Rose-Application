import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Overview } from './overview';
import { Admin } from '../../core/services/admin/admin.service';
import { of, throwError } from 'rxjs';
import { Component, Input, Output, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock للـ TranslatePipe عشان متعتمدش على TranslateModule
@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

// Mock Child Components
@Component({ selector: 'app-order-status-chart', standalone: true, template: '' })
class MockOrderStatusChart {
  @Input() orderStatusData: any;
}

@Component({ selector: 'app-revenue-chart', standalone: true, template: '' })
class MockRevenueChart {
  @Input() revenueData: any;
  @Output() periodChange = new EventEmitter<'monthly' | 'week'>();
}

describe('Overview Component', () => {
  let component: Overview;
  let fixture: ComponentFixture<Overview>;
  let adminServiceSpy: { getAllAdminStatistics: ReturnType<typeof vi.fn> };

  const mockApiResponse = {
    summary: { totalProducts: 120, totalOrders: 45, totalCategories: 8, totalRevenue: 15000, currency: 'EGP' },
    categories: [{ id: '1', title: 'Flowers', productCount: 50 }],
    orderStatus: { completed: { count: 30, percent: 60 }, inProgress: { count: 10, percent: 20 }, canceled: { count: 5, percent: 10 } },
    revenue: { monthly: [], week: [] },
    topSellingProducts: [{ productId: 'p1', title: 'Red Roses', unitPrice: 100, totalSales: 50 }],
    lowStockProducts: [{ id: 'l1', title: 'Black Wrap', stock: 2 }]
  };

  beforeEach(async () => {
    const adminServiceMock = {
      getAllAdminStatistics: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        Overview,
        MockTranslatePipe,
        MockOrderStatusChart,
        MockRevenueChart
      ],
      providers: [
        { provide: Admin, useValue: adminServiceMock }
      ]
    }).compileComponents();

    adminServiceSpy = TestBed.inject(Admin) as unknown as typeof adminServiceMock;
  });

  beforeEach(() => {
    adminServiceSpy.getAllAdminStatistics.mockReturnValue(of(mockApiResponse));
    fixture = TestBed.createComponent(Overview);
    component = fixture.componentInstance;
  });

  it('should create the Overview component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & Data Fetching', () => {
    it('should call getAllAdminStatistics with "monthly" on init and populate signals', () => {
      fixture.detectChanges();

      expect(adminServiceSpy.getAllAdminStatistics).toHaveBeenCalledWith('monthly');
      expect(component.summaryData()).toEqual(mockApiResponse.summary);
      expect(component.categoriesData()).toEqual(mockApiResponse.categories);
      expect(component.orderStatusData()).toEqual(mockApiResponse.orderStatus);
      expect(component.revenueData()).toEqual(mockApiResponse.revenue);
      expect(component.topSellingProducts()).toEqual(mockApiResponse.topSellingProducts);
      expect(component.lowStockProducts()).toEqual(mockApiResponse.lowStockProducts);
    });

    it('should handle empty or null values in response gracefully', () => {
      const emptyResponse = { summary: null, revenue: null };
      adminServiceSpy.getAllAdminStatistics.mockReturnValue(of(emptyResponse));

      fixture.detectChanges();

      expect(component.summaryData()).toBeNull();
      expect(component.categoriesData()).toEqual([]);
      expect(component.topSellingProducts()).toEqual([]);
      expect(component.lowStockProducts()).toEqual([]);
      expect(component.orderStatusData()).toBeNull();
    });
it('should log error on API failure', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const mockError = new Error('API Error');
  
  adminServiceSpy.getAllAdminStatistics.mockReturnValue(throwError(() => mockError));

  fixture.detectChanges();

  expect(consoleSpy).toHaveBeenCalledWith(mockError);
  consoleSpy.mockRestore();
});
});
describe('User Interactions & Period Changes', () => {
    it('should fetch new statistics when onRevenuePeriodChange is called', () => {
      fixture.detectChanges();

      component.onRevenuePeriodChange('week');

      expect(adminServiceSpy.getAllAdminStatistics).toHaveBeenCalledWith('week');
    });
  });
});