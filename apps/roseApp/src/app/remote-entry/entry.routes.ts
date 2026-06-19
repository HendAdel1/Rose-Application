import { Route } from '@angular/router';
import { MainLayout } from '../layout/main-layout/main-layout';
import { RemoteEntry } from './entry';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: MainLayout,
    children: [{ path: '', component: RemoteEntry }],
  },
];
