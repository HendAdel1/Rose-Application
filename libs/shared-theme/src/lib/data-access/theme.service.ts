import { Injectable, OnDestroy, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  private readonly _theme = signal<Theme>('light');

  /** Read-only view — components can read but not mutate the theme directly. */
  readonly theme = this._theme.asReadonly();

  constructor() {
    // Keep theme in sync across tabs/windows.
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.onStorageChange);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.onStorageChange);
    }
  }

  /** Call once at app startup (host + each standalone remote).
   * Uses applyTheme directly: the initial value may equal the signal's default
   * ('light'), which the setTheme guard would short-circuit, leaving the DOM
   * class unset. */
  init(): void {
    this.applyTheme(this.resolveInitialTheme());
  }

  toggle(): void {
    this.setTheme(this._theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    if (this._theme() === theme) {
      return;
    }

    this.applyTheme(theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage may be unavailable (private mode / SSR) — keep in-memory state.
    }
  }

  /** Updates the signal + the `dark` class without persisting (used by sync). */
  private applyTheme(theme: Theme): void {
    this._theme.set(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  private readonly onStorageChange = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    const next = event.newValue;
    if (next === 'light' || next === 'dark') {
      this.applyTheme(next);
    }
  };

  /** Saved choice wins; otherwise fall back to the OS preference. */
  private resolveInitialTheme(): Theme {
    const saved = this.readStoredTheme();
    if (saved) {
      return saved;
    }

    return typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private readStoredTheme(): Theme | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
    }
  }
}
