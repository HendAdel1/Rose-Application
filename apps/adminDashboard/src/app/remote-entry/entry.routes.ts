import { Route } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from '../environments/environment';
import { AdminLayout } from '../layout/admin-layout/admin-layout';
import { Overview } from '../features/overview/overview';
import { Categories } from '../features/categories/categories';
import { Occasions } from '../features/occasions/occasions';
import { AddOccasion } from '../features/occasions/components/add-occasion/add-occasion';
import { EditOccasion } from '../features/occasions/components/edit-occasion/edit-occasion';
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
      { path: 'occasions/add', component: AddOccasion, title: 'Add Occasion - Rose Dashboard' },
      { path: 'occasions/edit/:id', component: EditOccasion, title: 'Edit Occasion - Rose Dashboard' },
      { path: 'products', component: Products, title: 'Products - Rose Dashboard' },
    ],
  },
];
