import { Route } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from '../environments/environment';
import { MainLayout } from '../layout/main-layout/main-layout';
import { Home } from '../features/home/home';
import { ProductDetails } from '../features/product-details/product-details';
import { Products } from '../features/products/products';
import { Cart } from '../features/cart/cart';
import { authGuard } from '../core/guards/auth.guard';
import { Wishlist } from '../features/wishlist/wishlist';
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
      { path: 'cart', component: Cart, title: 'Cart', canActivate: [authGuard] },
    ],
  },
];
