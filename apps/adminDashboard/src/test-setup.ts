import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe(): void {
      // noop
    }
    unobserve(): void {
      // noop
    }
    disconnect(): void {
      // noop
    }
  } as unknown as typeof ResizeObserver;
}

setupTestBed();
