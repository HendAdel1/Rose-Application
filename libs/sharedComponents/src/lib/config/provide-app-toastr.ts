import { EnvironmentProviders } from '@angular/core';
import { GlobalConfig, provideToastr } from 'ngx-toastr';

import { NgxUiToast } from '../sharedComponents/ngx-ui-toast/ngx-ui-toast';

export function provideAppToastr(
  config: Partial<GlobalConfig> = {}
): EnvironmentProviders {
  return provideToastr({
    closeButton: true,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
    progressBar: false,
    toastComponent: NgxUiToast,
    ...config,
  });
}
