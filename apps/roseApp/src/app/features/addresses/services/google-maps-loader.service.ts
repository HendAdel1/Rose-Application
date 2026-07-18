import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private readonly scriptId = 'google-maps-script';
  private readonly document = inject(DOCUMENT);
  private loadingPromise?: Promise<void>;

  load(): Promise<void> {
    if (this.isLoaded()) {
      return Promise.resolve();
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const existingScript = this.document.getElementById(
        this.scriptId,
      ) as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), {
          once: true,
        });
        existingScript.addEventListener(
          'error',
          () => reject(new Error('Google Maps failed to load')),
          {
            once: true,
          },
        );
        return;
      }

      const script = this.document.createElement('script');
      script.id = this.scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.mapApiKey}&v=weekly&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps failed to load'));
      this.document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

  private isLoaded(): boolean {
    const win = this.document.defaultView as
      | (Window & {
          google?: { maps?: unknown };
        })
      | null;

    return Boolean(win?.google?.maps);
  }
}
