import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServerError } from './server-error';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ServerError Component', () => {
  let component: ServerError;
  let fixture: ComponentFixture<ServerError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerError],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServerError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have valid default dashboardUrl', () => {
    expect(component.dashboardUrl).toBe('/adminDashboard/overview');
  });

  it('should render the server error title and action buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#server-error-title')).toBeTruthy();
    const dashboardLink = compiled.querySelector('a[href="/adminDashboard/overview"]');
    expect(dashboardLink).toBeTruthy();
    const retryButton = compiled.querySelector('button');
    expect(retryButton).toBeTruthy();
  });

  it('should invoke reload when button is clicked', () => {
    const reloadSpy = vi.spyOn(component, 'reload').mockImplementation(() => undefined);
    const compiled = fixture.nativeElement as HTMLElement;
    const retryButton = compiled.querySelector('button');
    retryButton?.click();
    expect(reloadSpy).toHaveBeenCalled();
  });
});
