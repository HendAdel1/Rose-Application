import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Category } from '../../interface/Category';
import { CommonModule } from '@angular/common';
import { LucideMail, LucideCandy, LucideFlower, LucideX } from '@lucide/angular';
import { Occasion } from '../../interface/Occasion';
import { OccasionService } from '../../../../shared/products/services/occasion-service.service';

@Component({
  selector: 'app-products-filter',
  imports: [TranslatePipe,CommonModule, LucideMail, LucideCandy, LucideFlower, LucideX],
  templateUrl: './products-filter.html',
  styleUrl: './products-filter.css',
})
export class ProductsFilter implements OnInit {
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
  readonly occasionService=inject(OccasionService);
  readonly occasions = signal<Occasion[]>([]);

  ngOnInit(): void {
this.occasionService.getOccasions().subscribe((occasions: Occasion[]) => {
  this.occasions.set(occasions);
})
  }

  selectOccasion(id: string): void {
    this.occasionSelected.emit(id);
  }

}
