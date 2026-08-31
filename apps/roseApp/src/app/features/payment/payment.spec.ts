image.pngimport { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { CartService } from '../../core/services/cart.service';
import { AddressesService } from '../addresses/services/addresses.service';
import { PaymentService } from './services/payment.service';
import { Payment } from './payment';

describe('Payment', () => {
  let component: Payment;
  let fixture: ComponentFixture<Payment>;
  let router: Router;
  let toastr: { warning: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn>; success: ReturnType<typeof vi.fn> };
  let paymentService: {
    createOrder: ReturnType<typeof vi.fn>;
    createCheckoutSession: ReturnType<typeof vi.fn>;
    buildCheckoutRedirectUrls: ReturnType<typeof vi.fn>;
    isLoading: ReturnType<typeof signal<boolean>>;
  };
  let cartService: {
    clearCart: ReturnType<typeof vi.fn>;
    fetchCart: ReturnType<typeof vi.fn>;
    cartSubtotal: ReturnType<typeof signal<number>>;
    cartTotal: ReturnType<typeof signal<number>>;
  };
  let selectedAddress: ReturnType<typeof signal<{ id: string } | null>>;

  beforeEach(async () => {
    selectedAddress = signal<{ id: string } | null>({ id: 'address-1' });
    toastr = {
      warning: vi.fn(),
      error: vi.fn(),
      success: vi.fn(),
    };
    paymentService = {
      createOrder: vi.fn(),
      createCheckoutSession: vi.fn(),
      buildCheckoutRedirectUrls: vi.fn(() => ({
        successUrl: 'http://localhost:4200/checkout/success',
        cancelUrl: 'http://localhost:4200/roseApp/payment',
      })),
      isLoading: signal(false),
    };
    cartService = {
      clearCart: vi.fn((callback?: () => void) => callback?.()),
      fetchCart: vi.fn(),
      cartSubtotal: signal(100),
      cartTotal: signal(120),
    };

    await TestBed.configureTestingModule({
      imports: [Payment],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        { provide: AddressesService, useValue: { selectedAddress, loadAddresses: vi.fn() } },
        { provide: CartService, useValue: cartService },
        { provide: PaymentService, useValue: paymentService },
        { provide: ToastrService, useValue: toastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Payment);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('warns and redirects when checkout is attempted without an address', () => {
    selectedAddress.set(null);
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Select address');

    component.checkout();

    expect(toastr.warning).toHaveBeenCalledWith('Select address');
    expect(router.navigate).toHaveBeenCalledWith(['/roseApp/addresses']);
    expect(paymentService.createOrder).not.toHaveBeenCalled();
  });

  it('completes cash on delivery checkout without stripe redirect urls', () => {
    paymentService.createOrder.mockReturnValue(of({ orderId: 'order-cod-1' }));

    component.checkout();

    expect(paymentService.createOrder).toHaveBeenCalledWith({
      addressId: 'address-1',
      paymentMethod: 'CASH_ON_DELIVERY',
      successUrl: undefined,
      cancelUrl: undefined,
    });
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(component.isPaymentSuccess()).toBe(true);
    expect(toastr.success).toHaveBeenCalled();
  });

  it('uses checkout url from credit card order response without creating a new session', () => {
    component.selectMethod('CREDIT_CARD');
    paymentService.createOrder.mockReturnValue(
      of({
        orderId: 'order-card-1',
        checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_123',
      }),
    );

    component.checkout();

    expect(paymentService.createOrder).toHaveBeenCalledWith({
      addressId: 'address-1',
      paymentMethod: 'CREDIT_CARD',
      successUrl: 'http://localhost:4200/checkout/success',
      cancelUrl: 'http://localhost:4200/roseApp/payment',
    });
    expect(paymentService.createCheckoutSession).not.toHaveBeenCalled();
  });

  it('creates a checkout session when credit card order has no checkout url', () => {
    component.selectMethod('CREDIT_CARD');
    paymentService.createOrder.mockReturnValue(of({ orderId: 'order-card-2' }));
    paymentService.createCheckoutSession.mockReturnValue(
      of({
        checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_456',
        sessionId: 'cs_test_456',
        expiresAt: '2026-08-30T00:00:00.000Z',
        reused: false,
      }),
    );

    component.checkout();

    expect(paymentService.createCheckoutSession).toHaveBeenCalledWith({
      orderId: 'order-card-2',
      successUrl: 'http://localhost:4200/checkout/success',
      cancelUrl: 'http://localhost:4200/roseApp/payment',
    });
  });

  it('shows an error when checkout session creation returns no url', () => {
    component.selectMethod('CREDIT_CARD');
    paymentService.createOrder.mockReturnValue(of({ orderId: 'order-card-3' }));
    paymentService.createCheckoutSession.mockReturnValue(of({} as never));
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Checkout session error');

    component.checkout();

    expect(toastr.error).toHaveBeenCalledWith('Checkout session error');
  });
});
