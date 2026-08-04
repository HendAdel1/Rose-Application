import { Route } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from '../environments/environment';
import { MainLayout } from '../layout/main-layout/main-layout';
import { Home } from '../features/home/home';
import { ProductDetails } from '../features/product-details/product-details';
import { Products } from '../features/products/products';
import { Cart } from '../features/cart/cart';
import { Addresses } from '../features/addresses/addresses';
import { Payment } from '../features/payment/payment';
import { OrderConfirmation } from '../features/order-confirmation/order-confirmation';
import { authGuard } from '../core/guards/auth.guard';
import { Wishlist } from '../features/wishlist/wishlist';
import { Orders } from '../features/orders/orders';
export const remoteRoutes: Route[] = [
  {
    path: '',
    component: MainLayout,
    providers: [
      provideAuthDataAccess({
        apiBaseUrl: environment.baseUrl,
        apiRoot: environment.apiRoot,
      }),
    ],
    children: [
      { path: '', component: Home },
      { path: 'products', component: Products },
      { path: 'wishlist', component: Wishlist },
      { path: 'product-details', component: ProductDetails },
      { path: 'products/:id', component: ProductDetails },
      {
        path: 'cart',
        component: Cart,
        title: 'Cart',
        canActivate: [authGuard],
      },
      {
        path: 'addresses',
        component: Addresses,
        title: 'Addresses',
        canActivate: [authGuard],
      },
      {
        path: 'payment',
        component: Payment,
        title: 'Payment',
        canActivate: [authGuard],
      },
      {
        path: 'order-confirmation',
        component: OrderConfirmation,
        title: 'Order Confirmation',
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        component: Orders,
        title: 'Orders',
        canActivate: [authGuard],
      },
    ],
  },
];
