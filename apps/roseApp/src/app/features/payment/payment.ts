import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideTicket,
} from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
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

  readonly selectedAddress = this.addressesService.selectedAddress;
  readonly subtotal = this.cartService.cartSubtotal;
  readonly total = this.cartService.cartTotal;
  readonly isLoading = this.paymentService.isLoading;
  readonly selectedMethod = signal<PaymentMethod>('CASH_ON_DELIVERY');

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

          this.completeCheckout(orderId);
        },
        error: () => undefined,
      });
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
