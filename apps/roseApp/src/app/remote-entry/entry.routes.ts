import { Route } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from '../environments/environment';
import { MainLayout } from '../layout/main-layout/main-layout';
import { Home } from '../features/home/home';
import { ProductDetails } from '../features/product-details/product-details';
import { Products } from '../features/products/products';

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
      { path: 'product-details', component: ProductDetails },
      { path: 'products/:id', component: ProductDetails },
    ],
  },
];
