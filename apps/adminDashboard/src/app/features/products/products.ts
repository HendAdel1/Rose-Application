import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucidePackage, LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [TranslatePipe, LucidePackage, LucidePlus],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  readonly products = [
    { id: 1, name: 'Velvet Rose Deluxe Box', price: '450 EGP', category: 'Flowers', stock: 15 },
    { id: 2, name: 'Royal Belgian Chocolates', price: '320 EGP', category: 'Chocolate', stock: 28 },
    { id: 3, name: 'Handcrafted Golden Card', price: '75 EGP', category: 'Cards', stock: 50 },
    { id: 4, name: 'Ruby Romance Bouquet', price: '580 EGP', category: 'Flowers', stock: 8 },
  ];
}
