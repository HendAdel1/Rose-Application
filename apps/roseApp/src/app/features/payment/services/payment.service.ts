import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, take } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  CreateOrderPayload,
  OrderDto,
  PaymentIntentDto,
  PaymentIntentPayload,
} from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = `${environment.apiBaseUrl}/orders`;
  private readonly paymentIntentUrl = `${environment.apiBaseUrl}/payments/create-intent`;

  readonly isLoading = signal(false);

  createOrder(payload: CreateOrderPayload): Observable<string> {
    this.isLoading.set(true);

    return this.http
      .post<ApiResponse<OrderDto | { order?: OrderDto }>>(this.ordersUrl, payload)
      .pipe(
        take(1),
        map((response) => this.extractOrderId(response.payload)),
        finalize(() => this.isLoading.set(false)),
      );
  }

  createPaymentIntent(payload: PaymentIntentPayload): Observable<PaymentIntentDto> {
    this.isLoading.set(true);

    return this.http
      .post<ApiResponse<PaymentIntentDto>>(this.paymentIntentUrl, payload)
      .pipe(
        take(1),
        map((response) => response.payload ?? {}),
        finalize(() => this.isLoading.set(false)),
      );
  }

  private extractOrderId(payload?: OrderDto | { order?: OrderDto }): string {
    if (!payload) {
      return '';
    }

    if (this.hasNestedOrder(payload)) {
      return payload.order?.id ?? payload.order?.orderId ?? '';
    }

    return payload.id ?? payload.orderId ?? '';
  }

  private hasNestedOrder(payload: OrderDto | { order?: OrderDto }): payload is { order?: OrderDto } {
    return 'order' in payload;
  }
}
