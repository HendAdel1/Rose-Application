import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Unauthorized } from './unauthorized';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Unauthorized Component', () => {
  let component: Unauthorized;
  let fixture: ComponentFixture<Unauthorized>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Unauthorized],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Unauthorized);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have valid default dashboardUrl', () => {
    expect(component.dashboardUrl).toBe('/adminDashboard/overview');
  });


  it('should render the title and action buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#unauthorized-title')).toBeTruthy();
    const dashboardLink = compiled.querySelector('a[href="/adminDashboard/overview"]');
    expect(dashboardLink).toBeTruthy();
  });
});
