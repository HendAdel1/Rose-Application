export type AddressModalView = 'list' | 'form';

export interface GoogleMapsWindow extends Window {
  google?: any;
  gm_authFailure?: () => void;
}
