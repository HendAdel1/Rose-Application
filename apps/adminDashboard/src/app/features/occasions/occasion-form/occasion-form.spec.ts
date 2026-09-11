import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { OccasionForm } from './occasion-form';
import { OccasionsService } from '../services/occasions.service';

describe('OccasionForm Component', () => {
  let component: OccasionForm;
  let fixture: ComponentFixture<OccasionForm>;
  let occasionsServiceMock: {
    getOccasionById: ReturnType<typeof vi.fn>;
    uploadImage: ReturnType<typeof vi.fn>;
    createOccasion: ReturnType<typeof vi.fn>;
    updateOccasion: ReturnType<typeof vi.fn>;
    resolveImageUrl: ReturnType<typeof vi.fn>;
  };
  let toastrMock: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    occasionsServiceMock = {
      getOccasionById: vi.fn().mockReturnValue(
        of({ id: 'occ-1', title: 'Birthdays', image: 'https://cdn/b.png' }),
      ),
      uploadImage: vi.fn().mockReturnValue(of('/api/upload/temp/123')),
      createOccasion: vi.fn().mockReturnValue(of({ id: 'occ-2', title: 'Graduation' })),
      updateOccasion: vi.fn().mockReturnValue(of({ id: 'occ-1', title: 'Updated' })),
      resolveImageUrl: vi.fn().mockImplementation((path) => path),
    };

    toastrMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OccasionForm],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        { provide: OccasionsService, useValue: occasionsServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? null : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      ADMIN_OCCASIONS: {
        ADD_TITLE: 'Add a New Occasion',
        UPDATE_TITLE: 'Update Occasion: {{name}}',
        NAME_LABEL: 'Name',
        NAME_PLACEHOLDER: 'Enter occasion name',
        NAME_REQUIRED: 'Occasion name is required',
        IMAGE_LABEL: 'Occasion Image',
        IMAGE_LABEL_OPTIONAL: 'Occasion Image',
        IMAGE_PLACEHOLDER: 'Choose an image',
        IMAGE_REQUIRED: 'Occasion image is required',
        VIEW_IMAGE: 'View occasion image',
        REPLACE_IMAGE: 'Upload file',
        ADD_SUBMIT: 'Add Occasion',
        UPDATE_SUBMIT: 'Update Occasion',
        CREATE_SUCCESS: 'Occasion created successfully.',
        CREATE_ERROR: 'Unable to create occasion.',
        UPDATE_SUCCESS: 'Occasion updated successfully.',
        UPDATE_ERROR: 'Unable to update occasion.',
        LOAD_ERROR: 'Unable to load occasion.',
      },
    });
    translate.use('en');

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(OccasionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize in add mode when no id route param', () => {
    expect(component.mode()).toBe('add');
    expect(component.pageTitle()).toBe('Add a New Occasion');
    expect(component.formReady()).toBe(true);
  });

  it('should create occasion on valid submit in add mode', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const dummyFile = new File(['dummy'], 'test.png', { type: 'image/png' });

    component.onSubmit({
      valid: true,
      value: {
        title: 'Graduation',
        image: dummyFile,
      },
    });

    expect(occasionsServiceMock.uploadImage).toHaveBeenCalledWith(dummyFile);
    expect(occasionsServiceMock.createOccasion).toHaveBeenCalledWith({
      title: 'Graduation',
      image: '/api/upload/temp/123',
    });
    expect(toastrMock.success).toHaveBeenCalledWith('Occasion created successfully.');
    expect(navigateSpy).toHaveBeenCalledWith(['/adminDashboard/occasions']);
  });

  it('should handle creation error with toast', () => {
    occasionsServiceMock.createOccasion.mockReturnValue(
      throwError(() => ({ error: { message: 'Creation failed' } })),
    );
    const dummyFile = new File(['dummy'], 'test.png', { type: 'image/png' });

    component.onSubmit({
      valid: true,
      value: {
        title: 'Graduation',
        image: dummyFile,
      },
    });

    expect(toastrMock.error).toHaveBeenCalledWith('Creation failed');
    expect(component.loading()).toBe(false);
  });
});
