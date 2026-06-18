import { Route } from '@angular/router';
import { AuthLayout } from '../layouts/auth-layout/auth-layout';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from '../environments/environment';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: AuthLayout,
    providers:[provideAuthDataAccess({apiBaseUrl:environment.baseUrl})],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('../pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../pages/register/register').then((m) => m.Register),
      },
    ],
  },
];
