import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthSessionService } from '@org/auth-data-access';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AdminNavbar } from './navbar';
import { AdminLayoutService } from '../services/admin-layout.service';

describe('AdminNavbar', () => {
  const logoutMock = vi.fn();
  const mockUser = signal<{ firstName?: string; lastName?: string; email?: string } | null>({
    firstName: 'Sara',
    lastName: 'Ahmed',
    email: 'sara@example.com',
  });

  let layoutService: AdminLayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNavbar],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        AdminLayoutService,
        {
          provide: AuthSessionService,
          useValue: {
            currentUser: mockUser,
            isAuthenticated: signal(true),
            logout: logoutMock,
          },
        },
      ],
    }).compileComponents();

    layoutService = TestBed.inject(AdminLayoutService);
  });

  it('should create the navbar component', () => {
    const fixture = TestBed.createComponent(AdminNavbar);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should compute user initials and avatar color correctly', () => {
    const fixture = TestBed.createComponent(AdminNavbar);
    fixture.detectChanges();

    expect(fixture.componentInstance.avatarInitial()).toBe('S');
    expect(fixture.componentInstance.avatarColors().bg).toBeTruthy();
  });

  it('should toggle mobile profile menu', () => {
    const fixture = TestBed.createComponent(AdminNavbar);
    fixture.detectChanges();

    expect(fixture.componentInstance.profileMenuOpen()).toBe(false);
    fixture.componentInstance.toggleProfileMenu();
    expect(fixture.componentInstance.profileMenuOpen()).toBe(true);
  });

  it('should toggle sidebar via AdminLayoutService', () => {
    const fixture = TestBed.createComponent(AdminNavbar);
    fixture.detectChanges();

    expect(layoutService.sidebarOpen()).toBe(false);
    fixture.componentInstance.toggleSidebar();
    expect(layoutService.sidebarOpen()).toBe(true);
  });

  it('should reflect custom title in currentTitle', () => {
    const fixture = TestBed.createComponent(AdminNavbar);
    fixture.detectChanges();

    layoutService.setCustomTitle('Update Product: Wedding Flowers');
    fixture.detectChanges();

    expect(fixture.componentInstance.currentTitle()).toBe('Update Product: Wedding Flowers');
  });

  it('should toggle language via SharedI18nService', () => {
    const fixture = TestBed.createComponent(AdminNavbar);
    fixture.detectChanges();

    const initialLang = fixture.componentInstance.currentLanguage();
    fixture.componentInstance.toggleLanguage();
    fixture.detectChanges();

    expect(fixture.componentInstance.currentLanguage()).not.toBe(initialLang);
  });

  it('should toggle theme via ThemeService', () => {
    const fixture = TestBed.createComponent(AdminNavbar);
    fixture.detectChanges();

    const initialThemeState = fixture.componentInstance.isDark();
    fixture.componentInstance.toggleTheme();
    fixture.detectChanges();

    expect(fixture.componentInstance.isDark()).toBe(!initialThemeState);
  });

  it('should correctly compute language labels based on current language', () => {
    const fixture = TestBed.createComponent(AdminNavbar);
    fixture.detectChanges();

    if (fixture.componentInstance.currentLanguage() === 'en') {
      expect(fixture.componentInstance.languageLabel()).toBe('العربية');
      expect(fixture.componentInstance.languageShortCode()).toBe('عربي');
    } else {
      expect(fixture.componentInstance.languageLabel()).toBe('English');
      expect(fixture.componentInstance.languageShortCode()).toBe('EN');
    }
  });
});

