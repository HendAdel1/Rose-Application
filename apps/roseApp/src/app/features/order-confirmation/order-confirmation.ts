import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCheckCircle2, LucideArrowRight } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-confirmation',
  imports: [LucideCheckCircle2, LucideArrowRight, RouterLink, TranslatePipe],
  templateUrl: './order-confirmation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderConfirmation {}
