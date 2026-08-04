import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, take } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Order,
  OrdersApiResponse,
  OrdersQueryParams,
  SingleOrderApiResponse,
} from '../models/order.model';

export interface PaginatedOrdersResult {
  data: Order[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = `${environment.apiBaseUrl}/orders`;

  readonly isLoading = signal(false);

  /**
   * Get current user's orders (paginated, filtered by status/search)
   */
  getOrders(queryParams: OrdersQueryParams = {}): Observable<PaginatedOrdersResult> {
    this.isLoading.set(true);

    let params = new HttpParams();

    if (queryParams.page != null) {
      params = params.set('page', queryParams.page.toString());
    }

    if (queryParams.limit != null) {
      params = params.set('limit', queryParams.limit.toString());
    }

    if (queryParams.status) {
      params = params.set('status', queryParams.status);
    }

    if (queryParams.paymentStatus) {
      params = params.set('paymentStatus', queryParams.paymentStatus);
    }

    if (queryParams.search?.trim()) {
      params = params.set('search', queryParams.search.trim());
    }

    return this.http.get<OrdersApiResponse>(this.ordersUrl, { params }).pipe(
      take(1),
      map((response) => this.normalizeOrdersResponse(response, queryParams)),
      finalize(() => this.isLoading.set(false)),
    );
  }

  /**
   * Get single order details by ID
   */
  getOrderById(id: string): Observable<Order> {
    this.isLoading.set(true);

    return this.http.get<SingleOrderApiResponse>(`${this.ordersUrl}/${id}`).pipe(
      take(1),
      map((response) => this.normalizeSingleOrderResponse(response)),
      finalize(() => this.isLoading.set(false)),
    );
  }

  private normalizeOrdersResponse(
    res: OrdersApiResponse,
    queryParams: OrdersQueryParams,
  ): PaginatedOrdersResult {
    const defaultPage = queryParams.page ?? 1;
    const defaultLimit = queryParams.limit ?? 20;

    if (!res || !res.payload) {
      return {
        data: [],
        metadata: { total: 0, page: defaultPage, limit: defaultLimit, totalPages: 0 },
      };
    }

    if (Array.isArray(res.payload)) {
      const orders = res.payload;
      return {
        data: orders,
        metadata: {
          total: orders.length,
          page: defaultPage,
          limit: defaultLimit,
          totalPages: Math.ceil(orders.length / defaultLimit) || 1,
        },
      };
    }

    const payloadObj = res.payload;
    const data = payloadObj.orders ?? payloadObj.data ?? [];
    const total = payloadObj.total ?? payloadObj.count ?? data.length;
    const page = payloadObj.page ?? defaultPage;
    const limit = payloadObj.limit ?? defaultLimit;
    const totalPages = payloadObj.totalPages ?? (Math.ceil(total / limit) || 1);

    return {
      data,
      metadata: { total, page, limit, totalPages },
    };
  }

  private normalizeSingleOrderResponse(res: SingleOrderApiResponse): Order {
    if (!res || !res.payload) {
      throw new Error('Order not found');
    }

    if ('order' in res.payload && res.payload.order) {
      return res.payload.order;
    }

    return res.payload as Order;
  }
}
