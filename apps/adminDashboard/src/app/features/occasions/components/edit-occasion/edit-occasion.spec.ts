import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { EditOccasion } from './edit-occasion';
import { OccasionsService } from '../../services/occasions.service';

describe('EditOccasion', () => {
  const toastrMock = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const occasionsServiceMock = {
    getOccasionById: vi.fn().mockReturnValue(
      of({
        id: '123',
        title: 'Wedding',
        description: 'Wedding gifts',
        image: 'https://example.com/wedding.png',
      }),
    ),
    updateOccasion: vi.fn().mockReturnValue(of({ id: '123', title: 'Wedding & Flowers' })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOccasion],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        { provide: ToastrService, useValue: toastrMock },
        { provide: OccasionsService, useValue: occasionsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123',
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create and fetch occasion data on init', () => {
    const fixture = TestBed.createComponent(EditOccasion);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(occasionsServiceMock.getOccasionById).toHaveBeenCalledWith('123');
    expect(fixture.componentInstance.occasionTitle()).toBe('Wedding');
    expect(fixture.componentInstance.form.value.name).toBe('Wedding');
  });

  it('should update occasion on submit', () => {
    const fixture = TestBed.createComponent(EditOccasion);
    fixture.detectChanges();

    fixture.componentInstance.form.patchValue({ name: 'Wedding & Flowers' });
    fixture.componentInstance.onSubmit();

    expect(occasionsServiceMock.updateOccasion).toHaveBeenCalledWith('123', {
      title: 'Wedding & Flowers',
      description: 'Wedding gifts',
      image: undefined,
    });
    expect(toastrMock.success).toHaveBeenCalled();
  });
});
