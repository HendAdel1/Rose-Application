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

  onCategorySelected(categoryId: string): void {
    this.activeCategoryId.set(categoryId);
  }

  onOccasionSelected(occasionId: string): void {
    this.activeOccasionId.set(occasionId);
  }

  onFilterCleared(): void {
    this.activeCategoryId.set(null);
    this.activeOccasionId.set(null);
  }
}
