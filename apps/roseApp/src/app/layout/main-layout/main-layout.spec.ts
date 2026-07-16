import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthSessionService } from '@org/auth-data-access';
import { provideTranslateService } from '@ngx-translate/core';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), MainLayout],
      providers: [
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

  it('should render the rose app layout structure', () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
