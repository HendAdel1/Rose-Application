import { Injectable, signal } from '@angular/core';

/**
 * Service managing global admin layout state including the mobile sidebar drawer
 * and dynamic breadcrumb/title overrides across child views.
 */
@Injectable({ providedIn: 'root' })
export class AdminLayoutService {
  private readonly _sidebarOpen = signal<boolean>(false);
  private readonly _customTitle = signal<string | null>(null);

  /** Readonly signal indicating whether the mobile navigation drawer is open */
  readonly sidebarOpen = this._sidebarOpen.asReadonly();

  /** Readonly signal for dynamically set breadcrumb / page title */
  readonly customTitle = this._customTitle.asReadonly();

  /**
   * Toggles the mobile navigation drawer open/closed state.
   */
  toggleSidebar(): void {
    this._sidebarOpen.update((open) => !open);
  }

  /**
   * Opens the mobile navigation drawer.
   */
  openSidebar(): void {
    this._sidebarOpen.set(true);
  }

  /**
   * Closes the mobile navigation drawer.
   */
  closeSidebar(): void {
    this._sidebarOpen.set(false);
  }

  /**
   * Sets a dynamic page or entity title for the navbar breadcrumbs.
   *
   * @param title - The custom title string, or null to clear
   */
  setCustomTitle(title: string | null): void {
    this._customTitle.set(title);
  }

  /**
   * Clears the dynamic page or entity title.
   */
  clearCustomTitle(): void {
    this._customTitle.set(null);
  }
}
