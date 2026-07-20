import { Component, signal } from '@angular/core';
import { ProductsFilter } from './components/products-filter/products-filter';
import { ProductsGrid } from './components/products-grid/products-grid';

@Component({
  selector: 'app-products',
  imports: [ProductsFilter, ProductsGrid],
  templateUrl: './products.html',
})
export class Products {
  readonly activeCategoryId = signal<string | null>(null);
  readonly activeOccasionId = signal<string | null>(null);
  readonly activeRating = signal<number | null>(null);

  onCategorySelected(categoryId: string): void {
    this.activeCategoryId.set(categoryId);
  }

  onOccasionSelected(occasionId: string): void {
    this.activeOccasionId.set(occasionId);
  }
  onRatingSelected(rating: number): void {
    this.activeRating.set(rating);
  }

  onFilterCleared(): void {
    this.activeCategoryId.set(null);
    this.activeOccasionId.set(null);
    this.activeRating.set(0);
  }
  onFilterCategoryCleared(): void {
    this.activeCategoryId.set(null);
  } 
  onFilterOccasionCleared(): void {   
     this.activeOccasionId.set(null);
  }
  onFilterRatingCleared(): void {
    this.activeRating.set(0);
  } 
}
