import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

import { CartService } from '../../../core/services/cart.service';
import { PaymentService } from '../services/payment.service';
import { CheckoutSuccess } from './checkout-success';

describe('CheckoutSuccess', () => {
  let component: CheckoutSuccess;
  let fixture: ComponentFixture<CheckoutSuccess>;
  let router: Router;
  let toastr: { error: ReturnType<typeof vi.fn>; success: ReturnType<typeof vi.fn> };
  let paymentService: { getCheckoutSessionStatus: ReturnType<typeof vi.fn> };
  let cartService: { clearCart: ReturnType<typeof vi.fn> };
  let queryParamMap: Map<string, string>;

  beforeEach(async () => {
    queryParamMap = new Map();
    toastr = {
      error: vi.fn(),
      success: vi.fn(),
    };
    paymentService = {
      getCheckoutSessionStatus: vi.fn(),
    };
    cartService = {
      clearCart: vi.fn((callback?: () => void) => callback?.()),
    };

    await TestBed.configureTestingModule({
      imports: [CheckoutSuccess],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => queryParamMap.get(key) ?? null,
              },
            },
          },
        },
        { provide: PaymentService, useValue: paymentService },
        { provide: CartService, useValue: cartService },
        { provide: ToastrService, useValue: toastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutSuccess);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('should create', () => {
    queryParamMap.set('session_id', 'cs_test_123');
    paymentService.getCheckoutSessionStatus.mockReturnValue(
      of({ paymentStatus: 'paid', sessionStatus: 'complete' }),
    );

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('marks checkout as failed when session id is missing', () => {
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Missing session');

    fixture.detectChanges();

    expect(component.result()).toBe('failed');
    expect(toastr.error).toHaveBeenCalledWith('Missing session');
    expect(paymentService.getCheckoutSessionStatus).not.toHaveBeenCalled();
  });

  it('marks checkout as successful when payment status is paid', () => {
    queryParamMap.set('session_id', 'cs_test_paid');
    paymentService.getCheckoutSessionStatus.mockReturnValue(
      of({ paymentStatus: 'paid', sessionStatus: 'complete' }),
    );
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Order success');

    fixture.detectChanges();

    expect(paymentService.getCheckoutSessionStatus).toHaveBeenCalledWith('cs_test_paid');
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(component.result()).toBe('success');
    expect(toastr.success).toHaveBeenCalledWith('Order success');
  });

  it('marks checkout as successful when payment is not required', () => {
    queryParamMap.set('session_id', 'cs_test_free');
    paymentService.getCheckoutSessionStatus.mockReturnValue(
      of({ paymentStatus: 'no_payment_required', sessionStatus: 'complete' }),
    );

    fixture.detectChanges();

    expect(component.result()).toBe('success');
    expect(cartService.clearCart).toHaveBeenCalled();
  });

  it('marks checkout as failed when payment status is unpaid', () => {
    queryParamMap.set('session_id', 'cs_test_unpaid');
    paymentService.getCheckoutSessionStatus.mockReturnValue(
      of({ paymentStatus: 'unpaid', sessionStatus: 'open' }),
    );
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Payment failed');

    fixture.detectChanges();

    expect(component.result()).toBe('failed');
    expect(toastr.error).toHaveBeenCalledWith('Payment failed');
    expect(cartService.clearCart).not.toHaveBeenCalled();
  });

  it('marks checkout as failed when session status request errors', () => {
    queryParamMap.set('session_id', 'cs_test_error');
    paymentService.getCheckoutSessionStatus.mockReturnValue(
      throwError(() => new Error('network error')),
    );

    fixture.detectChanges();

    expect(component.result()).toBe('failed');
  });

  it('navigates to products when closing the modal', () => {
    component.closeModal();

    expect(router.navigate).toHaveBeenCalledWith(['/roseApp/products']);
  });

  it('navigates to orders page', () => {
    component.goToOrders();

    expect(router.navigate).toHaveBeenCalledWith(['/roseApp/orders']);
  });

  it('navigates to products when continuing shopping', () => {
    component.continueShopping();

    expect(router.navigate).toHaveBeenCalledWith(['/roseApp/products']);
  });
});
