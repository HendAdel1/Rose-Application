import { Route } from '@angular/router';
import { provideAuthDataAccess } from '@org/auth-data-access';

import { CheckoutSuccess } from '../features/payment/checkout-success/checkout-success';
import { environment } from '../environments/environment';

export const checkoutRoutes: Route[] = [
  {
    path: 'success',
    component: CheckoutSuccess,
    title: 'Payment Success',
    providers: [
      provideAuthDataAccess({
        apiBaseUrl: environment.baseUrl,
        apiRoot: environment.apiRoot,
      }),
    ],
  },
];
