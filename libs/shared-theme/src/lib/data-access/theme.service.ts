import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const THEME_COOKIE = 'rose.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>('light');

  /** Read-only view — components can read but not mutate the theme directly. */
  readonly theme = this._theme.asReadonly();

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
      this.writeCookie(THEME_COOKIE, theme);
    } catch {
      // Storage may be unavailable (private mode / SSR) — keep in-memory state.
    }
  }

  /** Updates the signal + the `dark` class without persisting. */
  private applyTheme(theme: Theme): void {
    this._theme.set(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

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
      const value = this.readCookie(THEME_COOKIE);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
    }
  }

  private readCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const prefix = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie
      .split('; ')
      .find((item) => item.startsWith(prefix));

    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
  }

  private writeCookie(name: string, value: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    const maxAge = 60 * 60 * 24 * 365;
    document.cookie =
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
      `Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  }
}
