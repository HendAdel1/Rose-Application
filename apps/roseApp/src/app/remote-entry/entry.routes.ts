import { Route } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from '../environments/environment';
import { MainLayout } from '../layout/main-layout/main-layout';
import { Home } from '../features/home/home';

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
    children: [{ path: '', component: Home }],
  },
];
