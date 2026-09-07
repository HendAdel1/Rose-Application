import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AddOccasion } from './add-occasion';
import { OccasionsService } from '../../services/occasions.service';

describe('AddOccasion', () => {
  const toastrMock = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const occasionsServiceMock = {
    createOccasion: vi.fn().mockReturnValue(of({ id: '1', title: 'Wedding' })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOccasion],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        { provide: ToastrService, useValue: toastrMock },
        { provide: OccasionsService, useValue: occasionsServiceMock },
      ],
    }).compileComponents();
  });

  it('should create the component and initialize empty form', () => {
    const fixture = TestBed.createComponent(AddOccasion);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.form.valid).toBe(false);
  });

  it('should validate required fields', () => {
    const fixture = TestBed.createComponent(AddOccasion);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.form.patchValue({ name: 'Graduation', image: 'data:image/png...' });
    expect(component.form.valid).toBe(true);
  });

  it('should call occasionsService.createOccasion on submit', () => {
    const fixture = TestBed.createComponent(AddOccasion);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.form.patchValue({ name: 'Anniversary', image: 'data:image/png...' });
    component.onSubmit();

    expect(occasionsServiceMock.createOccasion).toHaveBeenCalledWith({
      title: 'Anniversary',
      description: 'Anniversary',
      image: 'data:image/png...',
    });
    expect(toastrMock.success).toHaveBeenCalled();
  });
});
