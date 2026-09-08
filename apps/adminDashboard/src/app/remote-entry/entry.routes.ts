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
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('../features/error-pages/unauthorized/unauthorized').then(
            (m) => m.Unauthorized
          ),
        title: 'Unauthorized - Rose Dashboard',
      },
      { path: '401', redirectTo: 'unauthorized', pathMatch: 'full' },
      { path: '403', redirectTo: 'unauthorized', pathMatch: 'full' },
      {
        path: 'server-error',
        loadComponent: () =>
          import('../features/error-pages/server-error/server-error').then(
            (m) => m.ServerError
          ),
        title: 'Server Error - Rose Dashboard',
      },
      { path: '500', redirectTo: 'server-error', pathMatch: 'full' },
      {
        path: '404',
        loadComponent: () =>
          import('../features/error-pages/not-found/not-found').then(
            (m) => m.NotFound
          ),
        title: 'Page Not Found - Rose Dashboard',
      },
      {
        path: '**',
        loadComponent: () =>
          import('../features/error-pages/not-found/not-found').then(
            (m) => m.NotFound
          ),
        title: 'Page Not Found - Rose Dashboard',
      },
    ],
  },
];

