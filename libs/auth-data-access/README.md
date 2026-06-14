# auth-data-access

Centralized authentication data-access library for Rose applications.

It contains the shared authentication API services, token storage, session state,
standardized error mapping, and the authorization token interceptor.

## Usage

Register the library once in an application config:

```ts
import { provideAuthDataAccess } from '@org/auth-data-access';

export const appConfig = {
  providers: [
    provideAuthDataAccess({
      apiBaseUrl: '/api/auth',
    }),
  ],
};
```

Use `AuthApiService` for raw authentication API calls and
`AuthSessionService` when the app needs login/register side effects such as
storing the token and updating the current session.

## Running unit tests

Run `npx nx test auth-data-access` to execute the unit tests.

## lib flow

Login Form
   |
   v
AuthSessionService.login()
   |
   v
AuthApiService.login()
   |
   v
POST /api/auth/login
   |
   v
response contains token + user
   |
   v
TokenStorageService.saveAuthPayload()
   |
   v
AuthSessionService updates currentUser + isAuthenticated