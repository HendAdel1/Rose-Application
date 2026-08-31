import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideCheckCircle2,
  LucideListOrdered,
  LucideShoppingBag,
  LucideX,
  LucideXCircle,
} from '@lucide/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../../core/services/cart.service';
import { CheckoutSessionStatusDto } from '../models/payment.model';
import { PaymentService } from '../services/payment.service';

type CheckoutResult = 'loading' | 'success' | 'failed';

@Component({
  selector: 'app-checkout-success',
  imports: [
    LucideCheckCircle2,
    LucideXCircle,
    LucideListOrdered,
    LucideShoppingBag,
    LucideX,
    TranslatePipe,
  ],
  templateUrl: './checkout-success.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutSuccess implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paymentService = inject(PaymentService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly result = signal<CheckoutResult>('loading');

  ngOnInit(): void {
    this.verifyCheckoutSession();
  }

  closeModal(): void {
    void this.router.navigate(['/roseApp/products']);
  }

  goToOrders(): void {
    void this.router.navigate(['/roseApp/orders']);
  }

  continueShopping(): void {
    void this.router.navigate(['/roseApp/products']);
  }

  private verifyCheckoutSession(): void {
    const sessionId = this.getSessionId();

    if (!sessionId) {
      this.handleMissingSession();
      return;
    }

    this.loadCheckoutSessionStatus(sessionId);
  }

  private getSessionId(): string | null {
    return this.route.snapshot.queryParamMap.get('session_id');
  }

  private handleMissingSession(): void {
    this.result.set('failed');
    this.toastr.error(this.translate.instant('CHECKOUT.SUCCESS.MISSING_SESSION'));
  }

  private loadCheckoutSessionStatus(sessionId: string): void {
    this.paymentService
      .getCheckoutSessionStatus(sessionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (status) => this.handleSessionStatus(status),
        error: () => this.handleSessionError(),
      });
  }

  private handleSessionStatus(status: CheckoutSessionStatusDto): void {
    if (this.isPaymentSuccessful(status)) {
      this.handleSuccessfulPayment();
      return;
    }

    this.handleFailedPayment();
  }

  private isPaymentSuccessful(status: CheckoutSessionStatusDto): boolean {
    return (
      status.paymentStatus === 'paid' || status.paymentStatus === 'no_payment_required'
    );
  }

  private handleSuccessfulPayment(): void {
    this.cartService.clearCart(() => {
      this.result.set('success');
      this.toastr.success(this.translate.instant('PAYMENT.FEEDBACK.ORDER_SUCCESS'));
    });
  }

  private handleFailedPayment(): void {
    this.result.set('failed');
    this.toastr.error(this.translate.instant('CHECKOUT.SUCCESS.PAYMENT_FAILED'));
  }

  private handleSessionError(): void {
    this.result.set('failed');
  }
}
