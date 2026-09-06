import { Route } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from '../environments/environment';
import { AdminLayout } from '../layout/admin-layout/admin-layout';
import { Overview } from '../features/overview/overview';
import { Categories } from '../features/categories/categories';
import { Occasions } from '../features/occasions/occasions';
import { Products } from '../features/products/products';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: AdminLayout,
    providers: [
      provideAuthDataAccess({
        apiBaseUrl: environment.baseUrl,
        apiRoot: environment.apiRoot,
      }),
    ],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: Overview, title: 'Overview - Rose Dashboard' },
      { path: 'categories', component: Categories, title: 'Categories - Rose Dashboard' },
      { path: 'occasions', component: Occasions, title: 'Occasions - Rose Dashboard' },
      { path: 'products', component: Products, title: 'Products - Rose Dashboard' },
    ],
  },
];
