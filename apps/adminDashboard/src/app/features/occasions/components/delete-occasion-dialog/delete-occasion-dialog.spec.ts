import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { describe, expect, it, beforeEach } from 'vitest';
import { DeleteOccasionDialog } from './delete-occasion-dialog';

describe('DeleteOccasionDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOccasionDialog],
      providers: [
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    }).compileComponents();
  });

  it('should create the dialog component', () => {
    const fixture = TestBed.createComponent(DeleteOccasionDialog);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render modal if isOpen is false', () => {
    const fixture = TestBed.createComponent(DeleteOccasionDialog);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should render modal when isOpen is true', () => {
    const fixture = TestBed.createComponent(DeleteOccasionDialog);
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('occasionTitle', 'Wedding');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="dialog"]')).toBeTruthy();
    expect(compiled.textContent).toContain('Wedding');
  });
});
