import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { describe, expect, it, beforeEach } from 'vitest';
import { AdminBottomNav } from './bottom-nav';

describe('AdminBottomNav', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBottomNav],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    }).compileComponents();
  });

  it('should create the bottom nav component', () => {
    const fixture = TestBed.createComponent(AdminBottomNav);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render 4 navigation tabs and 1 center floating flower button', () => {
    const fixture = TestBed.createComponent(AdminBottomNav);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navTabs = compiled.querySelectorAll('.nav-tab');
    expect(navTabs.length).toBe(4);

    const floatingBtn = compiled.querySelector('.floating-flower-btn');
    expect(floatingBtn).toBeTruthy();
  });
});
