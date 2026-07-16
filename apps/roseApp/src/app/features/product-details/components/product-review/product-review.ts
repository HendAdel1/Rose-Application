import { Component, computed, input, signal } from '@angular/core';
import { ProductApiItem } from '../../../../shared/products/models/product-api-item.model';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomInput } from '@org/sharedComponents';
import { CustomButton } from '../../../../shared/custom-button/custom-button';
import { CustomHeading } from '../../../../shared/custom-heading/custom-heading';
import { LucideUser, LucideCalendar } from '@lucide/angular';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-review',
  imports: [
    RatingModule,
    FormsModule,
    CommonModule,
    CustomInput,
    CustomButton,
    CustomHeading,
    LucideUser,
    LucideCalendar,
    TranslatePipe,
  ],
  templateUrl: './product-review.html',
  styleUrl: './product-review.css',
})
export class ProductReview {
  readonly product = input.required<ProductApiItem>();

  readonly generalRating = computed<number>(() => this.product().rating ?? 0);
  readonly totalRatings = computed<number>(() => this.product()._count?.reviews ?? 0);

  readonly reviews = computed(() => {
    const rawReviews = this.product().reviews ?? [];
    return rawReviews.map(r => ({
      id: r.id,
      name: `${r.user?.firstName ?? ''} ${r.user?.lastName ?? ''}`.trim() || r.user?.username || 'Anonymous',
      date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rating: r.rating,
      title: r.headline,
      text: r.content,
    }));
  });

  newReviewRating = signal<number>(0);
}
