import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFound } from './not-found';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('NotFound Component', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have valid default dashboardUrl', () => {
    expect(component.dashboardUrl).toBe('/adminDashboard/overview');
  });

  it('should render the 404 title and navigation link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#not-found-title')).toBeTruthy();
    const dashboardLink = compiled.querySelector('a[href="/adminDashboard/overview"]');
    expect(dashboardLink).toBeTruthy();
  });
});
