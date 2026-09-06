import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthSessionService } from '@org/auth-data-access';
import { describe, expect, it, beforeEach } from 'vitest';
import { AdminLayout } from './admin-layout';

describe('AdminLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayout],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        {
          provide: AuthSessionService,
          useValue: {
            currentUser: signal(null),
            isAuthenticated: signal(false),
            logout: () => undefined,
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the admin layout component', () => {
    const fixture = TestBed.createComponent(AdminLayout);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render sidebar, navbar, bottom nav, and router outlet', () => {
    const fixture = TestBed.createComponent(AdminLayout);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-admin-sidebar')).toBeTruthy();
    expect(compiled.querySelector('app-admin-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-admin-bottom-nav')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
