import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, take } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  CheckoutSessionDto,
  CheckoutSessionPayload,
  CheckoutSessionStatusDto,
  CreateOrderPayload,
  CreateOrderResponsePayload,
  CreateOrderResult,
  OrderDto,
} from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = `${environment.apiBaseUrl}/orders`;
  private readonly checkoutSessionUrl = `${environment.apiBaseUrl}/payments/checkout-session`;

  readonly isLoading = signal(false);

  createOrder(payload: CreateOrderPayload): Observable<CreateOrderResult> {
    this.isLoading.set(true);

    return this.http
      .post<ApiResponse<CreateOrderResponsePayload | OrderDto>>(this.ordersUrl, payload)
      .pipe(
        take(1),
        map((response) => this.extractCreateOrderResult(response.payload)),
        finalize(() => this.isLoading.set(false)),
      );
  }

  createCheckoutSession(payload: CheckoutSessionPayload): Observable<CheckoutSessionDto> {
    this.isLoading.set(true);

    return this.http
      .post<ApiResponse<CheckoutSessionDto>>(this.checkoutSessionUrl, payload)
      .pipe(
        take(1),
        map((response) => response.payload ?? ({} as CheckoutSessionDto)),
        finalize(() => this.isLoading.set(false)),
      );
  }

  getCheckoutSessionStatus(sessionId: string): Observable<CheckoutSessionStatusDto> {
    this.isLoading.set(true);

    const params = new HttpParams().set('session_id', sessionId);

    return this.http
      .get<ApiResponse<CheckoutSessionStatusDto>>(this.checkoutSessionUrl, { params })
      .pipe(
        take(1),
        map((response) => response.payload ?? {}),
        finalize(() => this.isLoading.set(false)),
      );
  }

  buildCheckoutRedirectUrls(): { successUrl: string; cancelUrl: string } {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
      successUrl: `${origin}/checkout/success`,
      cancelUrl: `${origin}/roseApp/payment`,
    };
  }

  private extractCreateOrderResult(
    payload?: CreateOrderResponsePayload | OrderDto,
  ): CreateOrderResult {
    if (!payload) {
      return { orderId: '' };
    }

    if (this.hasNestedOrder(payload)) {
      return {
        orderId: payload.order?.id ?? payload.order?.orderId ?? '',
        checkoutUrl: payload.checkout?.checkoutUrl,
      };
    }

    return {
      orderId: payload.id ?? payload.orderId ?? '',
    };
  }

  private hasNestedOrder(
    payload: CreateOrderResponsePayload | OrderDto,
  ): payload is CreateOrderResponsePayload {
    return 'order' in payload || 'checkout' in payload;
  }
}
