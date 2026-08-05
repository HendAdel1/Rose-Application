import { Component } from '@angular/core';
import { ProductsFilter } from './components/products-filter/products-filter';
import { ProductsGrid } from './components/products-grid/products-grid';

@Component({
  selector: 'app-products',
  imports: [ProductsFilter, ProductsGrid],
  templateUrl: './products.html',
})
export class Products {}
