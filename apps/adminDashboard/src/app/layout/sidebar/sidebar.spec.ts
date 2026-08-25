import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthSessionService } from '@org/auth-data-access';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AdminSidebar } from './sidebar';

describe('AdminSidebar', () => {
  const logoutMock = vi.fn();
  const mockUser = signal<{ firstName?: string; lastName?: string; email?: string; photo?: string } | null>({
    firstName: 'Jonathan',
    lastName: 'Adrian',
    email: 'jonathan@example.com',
  });

  beforeEach(async () => {
    mockUser.set({
      firstName: 'Jonathan',
      lastName: 'Adrian',
      email: 'jonathan@example.com',
    });

    await TestBed.configureTestingModule({
      imports: [AdminSidebar],
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

  it('should create the sidebar component', () => {
    const fixture = TestBed.createComponent(AdminSidebar);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render brand logo and preview website button', () => {
    const fixture = TestBed.createComponent(AdminSidebar);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('img[alt="Rose"]')).toBeTruthy();
    expect(compiled.querySelector('.preview-website-btn')).toBeTruthy();
  });

  it('should render all 4 navigation items', () => {
    const fixture = TestBed.createComponent(AdminSidebar);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.sidebar-nav-item');
    expect(navLinks.length).toBe(4);
  });

  it('should display initial letter with unique background when no photo is provided', () => {
    const fixture = TestBed.createComponent(AdminSidebar);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('J');
    expect(fixture.componentInstance.avatarInitial()).toBe('J');
    expect(fixture.componentInstance.avatarColors().bg).toBeTruthy();
  });

  it('should toggle profile menu on click', () => {
    const fixture = TestBed.createComponent(AdminSidebar);
    fixture.detectChanges();

    expect(fixture.componentInstance.profileMenuOpen()).toBe(false);
    fixture.componentInstance.toggleProfileMenu();
    expect(fixture.componentInstance.profileMenuOpen()).toBe(true);
    fixture.componentInstance.closeProfileMenu();
    expect(fixture.componentInstance.profileMenuOpen()).toBe(false);
  });

  it('should call authSession.logout when logout is invoked', () => {
    const fixture = TestBed.createComponent(AdminSidebar);
    fixture.detectChanges();

    fixture.componentInstance.logout();
    expect(logoutMock).toHaveBeenCalled();
  });
});
