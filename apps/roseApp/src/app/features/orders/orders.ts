import { DecimalPipe, DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  LucideAlertCircle,
  LucideCalendar,
  LucideCheckCircle2,
  LucideChevronDown,
  LucideChevronUp,
  LucideClock,
  LucideCreditCard,
  LucidePackage,
  LucideSearch,
  LucideShoppingBag,
  LucideTruck,
  LucideXCircle,
} from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/types/paginator';
import { Order, OrderItem, OrderStatus } from './models/order.model';
import { OrdersService } from './services/orders.service';

@Component({
  selector: 'app-orders',
  imports: [
    DatePipe,
    DecimalPipe,
    LucideAlertCircle,
    LucideCheckCircle2,
    LucideChevronDown,
    LucideChevronUp,
    LucideClock,
    LucideCreditCard,
    LucidePackage,
    LucideShoppingBag,
    LucideTruck,
    LucideXCircle,
    PaginatorModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orders implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly destroyRef = inject(DestroyRef);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = this.ordersService.isLoading;
  readonly errorMessage = signal<string | null>(null);

  readonly page = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly totalRecords = signal<number>(0);
  readonly selectedStatus = signal<OrderStatus | null>(null);
  readonly searchTerm = signal<string>('');

  readonly expandedOrderIds = signal<Set<string>>(new Set());
  readonly paginatorFirst = computed(() => (this.page() - 1) * this.limit());

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.errorMessage.set(null);

    this.ordersService
      .getOrders({
        page: this.page(),
        limit: this.limit(),
        status: this.selectedStatus() ?? undefined,
        search: this.searchTerm() ?? undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.orders.set(result.data);
          this.totalRecords.set(result.metadata.total);
        },
        error: (err) => {
          console.error('Failed to load orders', err);
          this.errorMessage.set('Failed to load orders. Please try again later.');
        },
      });
  }

  onPageChange(event: PaginatorState): void {
    const nextPage = Math.floor((event.first ?? 0) / this.limit()) + 1;
    if (nextPage !== this.page()) {
      this.page.set(nextPage);
      this.loadOrders();
    }
  }

  onStatusFilter(status: OrderStatus | null): void {
    this.selectedStatus.set(status);
    this.page.set(1);
    this.loadOrders();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
    this.loadOrders();
  }

  toggleExpandOrder(orderId: string): void {
    this.expandedOrderIds.update((currentSet) => {
      const newSet = new Set(currentSet);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  }

  isExpanded(orderId: string): boolean {
    return this.expandedOrderIds().has(orderId);
  }

  getOrderItems(order: Order): OrderItem[] {
    return order.orderItems ?? order.items ?? [];
  }

  getVisibleItems(order: Order): OrderItem[] {
    const items = this.getOrderItems(order);
    if (this.isExpanded(order.id) || items.length <= 2) {
      return items;
    }
    return items.slice(0, Math.min(items.length, 4));
  }

  hasMoreItems(order: Order): boolean {
    return this.getOrderItems(order).length > 2;
  }

  getOrderNumber(order: Order): string {
    if (order.orderNumber) {
      return order.orderNumber.startsWith('#')
        ? order.orderNumber
        : `#${order.orderNumber}`;
    }
    return `#${order.id.substring(0, 6)}`;
  }

  getTotalPrice(order: Order): number {
    const price = order.totalPrice ?? order.subtotal ?? 0;
    return typeof price === 'string' ? parseFloat(price) || 0 : price;
  }

  getItemPrice(item: OrderItem): number {
    const price = item.price ?? item.product?.price ?? 0;
    return typeof price === 'string' ? parseFloat(price) || 0 : price;
  }

  getItemTitle(item: OrderItem): string {
    return item.product?.title ?? 'Product Item';
  }

  getItemCover(item: OrderItem): string {
    return item.product?.cover ?? item.product?.image ?? '/images/placeholder-product.png';
  }

  getItemRating(item: OrderItem): number {
    return item.product?.rating ?? 5;
  }

  getItemRatingsCount(item: OrderItem): number {
    return item.product?.ratings ?? 0;
  }
}
