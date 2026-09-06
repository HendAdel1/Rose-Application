import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthSessionService } from '@org/auth-data-access';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AdminNavbar } from './navbar';

describe('AdminNavbar', () => {
  const logoutMock = vi.fn();
  const mockUser = signal<{ firstName?: string; lastName?: string; email?: string } | null>({
    firstName: 'Sara',
    lastName: 'Ahmed',
    email: 'sara@example.com',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNavbar],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
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
});
