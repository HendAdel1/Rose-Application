import { Component, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Category } from '../../interface/Category';
import { CommonModule } from '@angular/common';
import { LucideMail, LucideCandy, LucideFlower, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-products-filter',
  imports: [TranslatePipe,CommonModule, LucideMail, LucideCandy, LucideFlower, LucideX],
  templateUrl: './products-filter.html',
  styleUrl: './products-filter.css',
})
export class ProductsFilter {
  readonly activeCategoryId = input<string | null>(null);
  readonly categorySelected = output<string>();
  readonly filterCleared = output<void>();

readonly categories = signal<Category[]>([
{ id: 'cards', name: 'Cards' },
    { id: 'chocolate', name: 'Chocolate' },
    { id: 'flowers', name: 'Flowers' },
    { id: 'cards', name: 'Cards' },
    { id: 'chocolate', name: 'Chocolate' },
    { id: 'flowers', name: 'Flowers' }
  ]);

  selectCategory(id: string): void {
    this.categorySelected.emit(id);
  }

  resetFilter(): void {
    this.filterCleared.emit();
  }
}
