import { Component } from '@angular/core';
import { CartItems } from './components/cart-items/cart-items';
import { Summary } from './components/summary/summary';
import { ProductsLike } from './components/products-like/products-like';

@Component({
  selector: 'app-cart',
  imports: [CartItems, Summary, ProductsLike],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {}
