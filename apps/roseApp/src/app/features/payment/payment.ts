import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideTicket,
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

  continueShoing(): void {
    void this.router.navigate(['/roseApp/products']);
  }

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
      this.createCardPayment(orderId);
      return;
    }

    this.completeCheckout(orderId);
  }

  private createCardPayment(orderId: string): void {
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

          if (intent.paymentIntentId || intent.clientSecret) {
            this.currentOrderId.set(orderId);
            this.currentPaymentIntentId.set(intent.paymentIntentId ?? null);
            this.showStripeModal.set(true);
          } else {
            this.completeCheckout(orderId);
          }
        },
        error: () => undefined,
      });
  }

  processStripePayment(): void {
    if (!this.stripeCard || !this.stripeCard.element) {
      this.toastr.error('Stripe element is not ready yet');
      return;
    }

    const orderId = this.currentOrderId();
    const paymentIntentId = this.currentPaymentIntentId();

    if (!orderId || !paymentIntentId) {
      this.toastr.error('Missing order or payment info');
      return;
    }

    this.isProcessingStripe.set(true);

    this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: this.stripeCard.element,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result.error) {
            this.isProcessingStripe.set(false);
            this.toastr.error(result.error.message || 'Card verification failed');
          } else if (result.paymentMethod) {
            this.confirmPaymentIntent(orderId, paymentIntentId, result.paymentMethod.id);
          }
        },
        error: (err) => {
          this.isProcessingStripe.set(false);
          this.toastr.error(err?.message || 'Payment failed');
        },
      });
  }

  private confirmPaymentIntent(orderId: string, paymentIntentId: string, paymentMethodId: string): void {
    this.paymentService
      .confirmPayment(paymentIntentId, paymentMethodId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isProcessingStripe.set(false);
          this.showStripeModal.set(false);
          this.completeCheckout(orderId);
        },
        error: (err) => {
          this.isProcessingStripe.set(false);
          this.toastr.error(err?.error?.message || 'Payment confirmation failed.');
        },
      });
  }

  closeStripeModal(): void {
    this.showStripeModal.set(false);
  }

  private completeCheckout(orderId: string): void {
    this.cartService.clearCart(() => {
      this.toastr.success(this.translate.instant('PAYMENT.FEEDBACK.ORDER_SUCCESS'));
      void this.router.navigate(['/roseApp/order-confirmation'], {
        queryParams: { orderId },
      });
    });
  }
}
