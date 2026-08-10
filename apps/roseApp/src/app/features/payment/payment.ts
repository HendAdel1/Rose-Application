import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideTicket,
  LucideCheckCircle2,
  LucideListOrdered,
  LucideShoppingBag,
} from '@lucide/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { StripeCardComponent, NgxStripeModule, StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../core/services/cart.service';
import { AddressesService } from '../addresses/services/addresses.service';
import { PaymentMethod } from './models/payment.model';
import { PaymentService } from './services/payment.service';

@Component({
  selector: 'app-payment',
  imports: [
    DecimalPipe,
    LucideArrowLeft,
    LucideArrowRight,
    LucideTicket,
    LucideCheckCircle2,
    LucideListOrdered,
    LucideShoppingBag,
    TranslatePipe,
    NgxStripeModule,
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Payment implements OnInit {
  private readonly addressesService = inject(AddressesService);
  private readonly cartService = inject(CartService);
  private readonly paymentService = inject(PaymentService);
  private readonly stripeService = inject(StripeService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly selectedAddress = this.addressesService.selectedAddress;
  readonly subtotal = this.cartService.cartSubtotal;
  readonly total = this.cartService.cartTotal;
  readonly isLoading = this.paymentService.isLoading;
  readonly selectedMethod = signal<PaymentMethod>('CASH_ON_DELIVERY');

  readonly showStripeModal = signal<boolean>(false);
  readonly isPaymentSuccess = signal<boolean>(false);
  readonly currentOrderId = signal<string | null>(null);
  readonly currentPaymentIntentId = signal<string | null>(null);
  readonly isProcessingStripe = signal<boolean>(false);

  @ViewChild(StripeCardComponent, { static: false }) stripeCard!: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '400',
        fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  ngOnInit(): void {
    this.addressesService.loadAddresses();
    this.cartService.fetchCart();
  }

  selectMethod(method: PaymentMethod): void {
    this.selectedMethod.set(method);
  }

  backToAddresses(): void {
    void this.router.navigate(['/roseApp/addresses']);
  }

  goToOrders(): void {
    void this.router.navigate(['/roseApp/orders']);
  }

  continueShopping(): void {
    void this.router.navigate(['/roseApp/products']);
  }

  // Step 1: Create Order & Trigger Direct Payment Process
  checkout(): void {
    const address = this.selectedAddress();

    if (!address) {
      this.toastr.warning(this.translate.instant('PAYMENT.FEEDBACK.SELECT_ADDRESS'));
      void this.router.navigate(['/roseApp/addresses']);
      return;
    }

    this.paymentService
      .createOrder({
        addressId: address.id,
        paymentMethod: this.selectedMethod(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orderId) => this.handleOrderCreated(orderId),
        error: () => undefined,
      });
  }

  private handleOrderCreated(orderId: string): void {
    if (!orderId) {
      this.toastr.error(this.translate.instant('PAYMENT.FEEDBACK.CREATE_ORDER_ERROR'));
      return;
    }

    if (this.selectedMethod() === 'CREDIT_CARD') {
      this.createAndConfirmCardPayment(orderId);
      return;
    }

    this.completeCheckout(orderId);
  }

  // Step 1 (PaymentIntent) -> Step 2 (Direct Confirm with pm_card_visa)
  private createAndConfirmCardPayment(orderId: string): void {
    this.paymentService
      .createPaymentIntent({ orderId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (intent) => {
          const redirectUrl = intent.checkoutUrl ?? intent.url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }

          const paymentIntentId = intent.paymentIntentId ?? intent.id;

          if (paymentIntentId) {
            this.currentOrderId.set(orderId);
            this.currentPaymentIntentId.set(paymentIntentId);

            // Step 2: Directly confirm using fixed test card token
            this.confirmDirectPayment(orderId, paymentIntentId, 'pm_card_visa');
          } else {
            this.completeCheckout(orderId);
          }
        },
        error: () => undefined,
      });
  }

  private confirmDirectPayment(orderId: string, paymentIntentId: string, paymentMethodId: string): void {
    this.paymentService
      .confirmPayment(paymentIntentId, paymentMethodId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.completeCheckout(orderId);
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Payment confirmation failed.');
        },
      });
  }

  private completeCheckout(orderId: string): void {
    this.cartService.clearCart(() => {
      this.toastr.success(this.translate.instant('PAYMENT.FEEDBACK.ORDER_SUCCESS'));
      this.isPaymentSuccess.set(true);
    });
  }
}
