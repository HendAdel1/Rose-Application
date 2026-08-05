import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { LucideTicket, LucideArrowRight } from '@lucide/angular';
import { CustomButton } from '../../../../shared/custom-button/custom-button';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../../../core/services/cart.service';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  imports: [LucideTicket, LucideArrowRight, CustomButton, TranslatePipe, DecimalPipe],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Summary {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly subtotal = this.cartService.cartSubtotal;
  readonly total = this.cartService.cartTotal;
  readonly isCartEmpty = computed(() => this.cartService.cartItemsAPI().length === 0);

  goToCheckout(): void {
    if (this.isCartEmpty()) {
      return;
    }
    void this.router.navigate(['/roseApp/addresses']);
  }
}
