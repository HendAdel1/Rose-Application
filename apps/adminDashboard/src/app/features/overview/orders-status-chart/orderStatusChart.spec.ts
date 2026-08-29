import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderStatusChart } from './orderStatusChart';

describe('OrderStatusChart', () => {
  let component: OrderStatusChart;
  let fixture: ComponentFixture<OrderStatusChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusChart],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
