import { Route } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';
import { environment } from '../environments/environment';
import { MainLayout } from '../layout/main-layout/main-layout';
import { RemoteEntry } from './entry';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: MainLayout,
    providers: [provideAuthDataAccess({ apiBaseUrl: environment.baseUrl })],
    children: [{ path: '', component: RemoteEntry }],
  },
];
