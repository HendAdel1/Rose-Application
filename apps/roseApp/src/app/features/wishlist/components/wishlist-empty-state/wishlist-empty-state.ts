import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-wishlist-empty-state',
  imports: [LucideArrowLeft, RouterLink, TranslatePipe],
  templateUrl: './wishlist-empty-state.html',
  styleUrl: './wishlist-empty-state.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistEmptyState {
  readonly emptyImage = '/images/empty-wishlist.webp';
}
