import { Route } from '@angular/router';
import { AuthLayout } from '../layouts/auth-layout/auth-layout';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: AuthLayout,
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
        path: 'forgot-password',
        loadComponent: () =>
          import('../pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
      },
    ],
  },
];
