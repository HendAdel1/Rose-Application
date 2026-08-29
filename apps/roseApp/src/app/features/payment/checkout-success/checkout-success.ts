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
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      this.result.set('failed');
      this.toastr.error(this.translate.instant('CHECKOUT.SUCCESS.MISSING_SESSION'));
      return;
    }

    this.paymentService
      .getCheckoutSessionStatus(sessionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (status) => {
          if (status.paymentStatus === 'paid' || status.paymentStatus === 'no_payment_required') {
            this.cartService.clearCart(() => {
              this.result.set('success');
              this.toastr.success(this.translate.instant('PAYMENT.FEEDBACK.ORDER_SUCCESS'));
            });
            return;
          }

          this.result.set('failed');
          this.toastr.error(this.translate.instant('CHECKOUT.SUCCESS.PAYMENT_FAILED'));
        },
        error: () => {
          this.result.set('failed');
        },
      });
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
}
