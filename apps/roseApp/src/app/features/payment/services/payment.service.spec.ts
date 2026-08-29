import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  const ordersUrl = 'https://rose-app.elevate-bootcamp.cloud/api/orders';
  const checkoutSessionUrl =
    'https://rose-app.elevate-bootcamp.cloud/api/payments/checkout-session';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentService, provideHttpClientTesting()],
    });

    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('creates an order and extracts nested order id with checkout url', () => {
    let result: { orderId: string; checkoutUrl?: string } | undefined;

    service
      .createOrder({
        addressId: 'address-id',
        paymentMethod: 'CREDIT_CARD',
        successUrl: 'http://localhost:4200/checkout/success',
        cancelUrl: 'http://localhost:4200/roseApp/payment',
      })
      .subscribe((response) => {
        result = response;
      });

    const request = httpMock.expectOne(ordersUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      addressId: 'address-id',
      paymentMethod: 'CREDIT_CARD',
      successUrl: 'http://localhost:4200/checkout/success',
      cancelUrl: 'http://localhost:4200/roseApp/payment',
    });

    request.flush({
      status: true,
      code: 201,
      payload: {
        order: { id: 'order-123' },
        checkout: {
          checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_123',
          sessionId: 'cs_test_123',
          expiresAt: '2026-08-30T00:00:00.000Z',
          reused: false,
        },
      },
    });

    expect(result).toEqual({
      orderId: 'order-123',
      checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_123',
    });
    expect(service.isLoading()).toBe(false);
  });

  it('creates an order and extracts a flat order id', () => {
    let orderId = '';

    service
      .createOrder({
        addressId: 'address-id',
        paymentMethod: 'CASH_ON_DELIVERY',
      })
      .subscribe((response) => {
        orderId = response.orderId;
      });

    const request = httpMock.expectOne(ordersUrl);
    request.flush({
      status: true,
      code: 201,
      payload: { id: 'flat-order-id' },
    });

    expect(orderId).toBe('flat-order-id');
  });

  it('creates a checkout session for an order', () => {
    let checkoutUrl = '';

    service
      .createCheckoutSession({
        orderId: 'order-123',
        successUrl: 'http://localhost:4200/checkout/success',
        cancelUrl: 'http://localhost:4200/roseApp/payment',
      })
      .subscribe((session) => {
        checkoutUrl = session.checkoutUrl;
      });

    const request = httpMock.expectOne(checkoutSessionUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      orderId: 'order-123',
      successUrl: 'http://localhost:4200/checkout/success',
      cancelUrl: 'http://localhost:4200/roseApp/payment',
    });

    request.flush({
      status: true,
      code: 201,
      payload: {
        checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_456',
        sessionId: 'cs_test_456',
        expiresAt: '2026-08-30T00:00:00.000Z',
        reused: false,
      },
    });

    expect(checkoutUrl).toBe('https://checkout.stripe.com/c/pay/cs_test_456');
    expect(service.isLoading()).toBe(false);
  });

  it('fetches checkout session status by session id', () => {
    let paymentStatus = '';

    service.getCheckoutSessionStatus('cs_test_789').subscribe((status) => {
      paymentStatus = status.paymentStatus ?? '';
    });

    const request = httpMock.expectOne(
      (req) =>
        req.url === checkoutSessionUrl &&
        req.params.get('session_id') === 'cs_test_789',
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      status: true,
      code: 200,
      payload: {
        sessionId: 'cs_test_789',
        paymentStatus: 'paid',
        sessionStatus: 'complete',
      },
    });

    expect(paymentStatus).toBe('paid');
    expect(service.isLoading()).toBe(false);
  });

  it('builds redirect urls from the current origin', () => {
    const urls = service.buildCheckoutRedirectUrls();

    expect(urls.successUrl).toBe(`${window.location.origin}/checkout/success`);
    expect(urls.cancelUrl).toBe(`${window.location.origin}/roseApp/payment`);
  });
});
