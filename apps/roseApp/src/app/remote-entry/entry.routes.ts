import { Route } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from '../environments/environment';
import { MainLayout } from '../layout/main-layout/main-layout';
import { Home } from '../features/home/home';
import { ProductDetails } from '../features/product-details/product-details';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: MainLayout,
    providers: [provideAuthDataAccess({ apiBaseUrl: environment.baseUrl })],
    children: [
      { path: '', component: Home },
      { path: 'product-details', component: ProductDetails },
      { path: 'products/:id', component: ProductDetails },
    ],
  },
];
