import { Component, inject, input, model, OnInit, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Category } from '../../interface/Category';
import { CommonModule } from '@angular/common';
import { LucideMail, LucideCandy, LucideFlower, LucideX, LucideRotateCcw } from '@lucide/angular';
import { Occasion } from '../../interface/Occasion';
import { OccasionService } from '../../../../shared/products/services/occasion-service.service';
import { categoriesService } from '../../../../shared/products/services/categoriesService.service';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../../../shared/products/services/rating-service.service';
import { Review } from '../../interface/Rating';

@Component({
  selector: 'app-products-filter',
  imports: [TranslatePipe,CommonModule, LucideMail, LucideCandy, LucideFlower, LucideX,RatingModule, FormsModule,LucideRotateCcw],
  templateUrl: './products-filter.html',
  styleUrl: './products-filter.css',
})
export class ProductsFilter implements OnInit {
  private readonly categoriesService = inject(categoriesService);
  private readonly ratingService = inject(RatingService);
  readonly activeCategoryId = input<string | null>(null);
  readonly activeRating = model<number | null>(null);
  readonly categorySelected = output<string>();
  readonly filterCategoryCleared = output<void>();
  readonly filterOccasionCleared = output<void>();
  readonly filterRatingCleared = output<void>();
  readonly filterCleared = output<void>();
  readonly ratingSelected = output<number>();
  readonly categories = signal<Category[]>([])
  readonly ratings = signal<number[]>([])
  ngOnInit(): void {
this.categoriesService.getCategories().subscribe({
  next: (res) => {
const activeCategories = res.filter(category => category._count?.products > 0);
  this.categories.set(activeCategories);
  }
});
this.occasionService.getOccasions().subscribe((occasions: Occasion[]) => {
  this.occasions.set(occasions);
});
this.ratingService.getReviews().subscribe((ratings: Review[]) => {
  this.ratings.set(ratings.map(r => r.rating)); 
  // console.log(ratings);
  

  
});
  }

  selectCategory(id: string): void {
    this.categorySelected.emit(id);
    // console.log(this.categorySelected);

  }
  selectRating(rating: number): void {
    this.ratingSelected.emit(rating);
  }

  resetCategoryFilter(): void {
    this.filterCategoryCleared.emit();
  }
  
  resetOccasionFilter(): void {
    this.filterOccasionCleared.emit();
  }
  resetRatingFilter(): void {
    this.filterRatingCleared.emit();
  }
  resetFilter(): void {
    this.filterCleared.emit();
  }

  // filter by occasion
  readonly activeOccasionId = input<string | null>(null);
  readonly occasionSelected = output<string>();
  readonly occasionService=inject(OccasionService);
  readonly occasions = signal<Occasion[]>([]);


  selectOccasion(id: string): void {
    this.occasionSelected.emit(id);
  }

}
