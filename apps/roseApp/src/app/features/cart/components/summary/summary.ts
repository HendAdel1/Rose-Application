import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LucideTicket, LucideArrowRight } from '@lucide/angular';
import { CustomButton } from '../../../../shared/custom-button/custom-button';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../../../core/services/cart.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-summary',
  imports: [LucideTicket, LucideArrowRight, CustomButton, TranslatePipe, DecimalPipe],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Summary {
  private readonly cartService = inject(CartService);

  readonly subtotal = this.cartService.cartSubtotal;
  readonly total = this.cartService.cartTotal;
}
