import { Component, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Category } from '../../interface/Category';
import { CommonModule } from '@angular/common';
import { LucideMail, LucideCandy, LucideFlower, LucideX } from '@lucide/angular';
import { Occasion } from '../../interface/Occasion';

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
{ id: 'Cards', name: 'Cards' },
    { id: 'Chocolate', name: 'Chocolate' },
    { id: 'Flowers', name: 'Flowers' },
    { id: 'Cards', name: 'Cards' },
    { id: 'Chocolate', name: 'Chocolate' },
    { id: 'Flowers', name: 'Flowers' },
    { id: 'Cards', name: 'Cards' },
    { id: 'Chocolate', name: 'Chocolate' },
    { id: 'Flowers', name: 'Flowers' },
  ]);

  selectCategory(id: string): void {
    this.categorySelected.emit(id);
    console.log(this.categorySelected);

  }

  resetFilter(): void {
    this.filterCleared.emit();
  }
  // filter by occasion
  readonly activeOccasionId = input<string | null>(null);
  readonly occasionSelected = output<string>();

  readonly occasions = signal<Occasion[]>([
    { id: 'Wedding', name: 'Wedding', imageUrl: '/occasions/wedding.webp' },
    { id: 'Apology', name: 'Apology', imageUrl: '/occasions/apology.webp' },
    { id: 'Graduation', name: 'Graduation', imageUrl: '/occasions/graduation.jpg' },
        { id: 'Wedding', name: 'Wedding', imageUrl: '/occasions/wedding.webp' },
    { id: 'FatherDay', name: 'Father\'s Day', imageUrl: '/occasions/father.webp' },
        { id: 'Graduation', name: 'Graduation', imageUrl: '/occasions/graduation.jpg' },
  ]);

  selectOccasion(id: string): void {
    this.occasionSelected.emit(id);
console.log(this.occasionSelected);
  }

}
