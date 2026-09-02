import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../core/services/cart.service';
import { AddressesService } from '../addresses/services/addresses.service';
import { PaymentMethod } from './models/payment.model';
import { PaymentService } from './services/payment.service';
import { NotificationsService } from '../../layout/navbar/components/notifications/services/notifications.service';

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
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Payment implements OnInit {
  private readonly addressesService = inject(AddressesService);
  private readonly cartService = inject(CartService);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationsService = inject(NotificationsService);

  readonly selectedAddress = this.addressesService.selectedAddress;
  readonly subtotal = this.cartService.cartSubtotal;
  readonly total = this.cartService.cartTotal;
  readonly isLoading = this.paymentService.isLoading;
  readonly selectedMethod = signal<PaymentMethod>('CASH_ON_DELIVERY');
  readonly isPaymentSuccess = signal<boolean>(false);

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

  checkout(): void {
    const address = this.selectedAddress();

    if (!address) {
      this.toastr.warning(this.translate.instant('PAYMENT.FEEDBACK.SELECT_ADDRESS'));
      void this.router.navigate(['/roseApp/addresses']);
      return;
    }

    const isCardPayment = this.selectedMethod() === 'CREDIT_CARD';
    const redirectUrls = isCardPayment ? this.paymentService.buildCheckoutRedirectUrls() : undefined;

    this.paymentService
      .createOrder({
        addressId: address.id,
        paymentMethod: this.selectedMethod(),
        successUrl: redirectUrls?.successUrl,
        cancelUrl: redirectUrls?.cancelUrl,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.handleOrderCreated(result),
        error: () => undefined,
      });
  }

  private handleOrderCreated(result: { orderId: string; checkoutUrl?: string }): void {
    if (!result.orderId) {
      this.toastr.error(this.translate.instant('PAYMENT.FEEDBACK.CREATE_ORDER_ERROR'));
      return;
    }

    if (this.selectedMethod() === 'CREDIT_CARD') {
      this.redirectToStripeCheckout(result.orderId, result.checkoutUrl);
      return;
    }

    this.completeCheckout();
  }

  private redirectToStripeCheckout(orderId: string, checkoutUrl?: string): void {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }

    const { successUrl, cancelUrl } = this.paymentService.buildCheckoutRedirectUrls();

    this.paymentService
      .createCheckoutSession({ orderId, successUrl, cancelUrl })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (session) => {
          if (session.checkoutUrl) {
            window.location.href = session.checkoutUrl;
            return;
          }

          this.toastr.error(this.translate.instant('PAYMENT.FEEDBACK.CHECKOUT_SESSION_ERROR'));
        },
        error: () => undefined,
      });
  }

  private completeCheckout(): void {
    this.cartService.clearCart(() => {
      this.notificationsService.refreshUnreadCount();
      this.toastr.success(this.translate.instant('PAYMENT.FEEDBACK.ORDER_SUCCESS'));
      this.isPaymentSuccess.set(true);
    });
  }
}
