import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, take } from 'rxjs';
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

  /**
   * Get current user's orders (paginated, filtered by status/search)
   */
  getOrders(queryParams: OrdersQueryParams = {}): Observable<PaginatedOrdersResult> {
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
    );
  }

  /**
   * Get single order details by ID
   */
  getOrderById(id: string): Observable<Order> {
    return this.http.get<SingleOrderApiResponse>(`${this.ordersUrl}/${id}`).pipe(
      take(1),
      map((response) => this.normalizeSingleOrderResponse(response)),
    );
  }

  private normalizeOrdersResponse(
    res: OrdersApiResponse,
    queryParams: OrdersQueryParams,
  ): PaginatedOrdersResult {
    const defaultPage = queryParams.page ?? 1;
    const defaultLimit = queryParams.limit ?? 5;

    if (!res || !res.payload) {
      return {
        data: [],
        metadata: { total: 0, page: defaultPage, limit: defaultLimit, totalPages: 0 },
      };
    }

    const resAny = res as any;
    const payloadObj = Array.isArray(res.payload) ? null : (res.payload as any);

    let allOrders: Order[] = [];
    if (Array.isArray(res.payload)) {
      allOrders = res.payload;
    } else if (payloadObj) {
      allOrders = payloadObj.orders ?? payloadObj.data ?? [];
    }

    const hasExplicitTotal =
      resAny.total != null ||
      resAny.count != null ||
      resAny.totalCount != null ||
      resAny.totalRecords != null ||
      resAny.metadata?.total != null ||
      payloadObj?.total != null ||
      payloadObj?.count != null ||
      payloadObj?.totalOrders != null ||
      payloadObj?.totalCount != null ||
      payloadObj?.totalRecords != null ||
      payloadObj?.metadata?.total != null;

    let total =
      resAny.total ??
      resAny.count ??
      resAny.totalCount ??
      resAny.totalRecords ??
      resAny.metadata?.total ??
      payloadObj?.total ??
      payloadObj?.count ??
      payloadObj?.totalOrders ??
      payloadObj?.totalCount ??
      payloadObj?.totalRecords ??
      payloadObj?.metadata?.total ??
      allOrders.length;

    const page = payloadObj?.page ?? defaultPage;
    const limit = payloadObj?.limit ?? defaultLimit;

    let data = allOrders;
    if (allOrders.length > limit) {
      const startIndex = (page - 1) * limit;
      data = allOrders.slice(startIndex, startIndex + limit);
    }

    if (!hasExplicitTotal && data.length === limit) {
      total = Math.max(total, page * limit + 1);
    }

    const totalPages = Math.ceil(total / limit) || 1;

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
