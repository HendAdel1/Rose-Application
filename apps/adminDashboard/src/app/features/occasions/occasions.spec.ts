import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Occasions } from './occasions';
import { OccasionsService } from './services/occasions.service';
import { OccasionRow } from './models/occasion-row.model';

describe('Occasions Component', () => {
  let component: Occasions;
  let fixture: ComponentFixture<Occasions>;
  let occasionsService: OccasionsService;
  let router: Router;
  let toastrMock: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  const mockOccasionRow: OccasionRow = {
    id: 'occ-1',
    name: 'Weddings',
    products: 10,
    description: 'Wedding gifts',
    image: 'https://cdn/wedding.png',
  };

  beforeEach(async () => {
    toastrMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Occasions],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      DASHBOARD: { OCCASIONS: 'Occasions' },
      ADMIN_OCCASIONS: {
        ADD_NEW: 'Add Occasion',
        DELETE_SUCCESS: 'Occasion deleted successfully.',
        DELETE_ERROR: 'Unable to delete occasion.',
      },
      CONFIRM_DIALOG: {
        DELETE_MESSAGE: 'Are you sure you want to delete this {{entity}}?',
        CONFIRM: 'Confirm',
        CANCEL: 'Cancel',
        CLOSE: 'Close',
        ARIA_LABEL: 'Delete confirmation',
        ENTITIES: { OCCASION: 'occasion' },
      },
    });
    translate.use('en');

    occasionsService = TestBed.inject(OccasionsService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(Occasions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Occasions component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to add page on onAddOccasion', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onAddOccasion();
    expect(navigateSpy).toHaveBeenCalledWith(['/adminDashboard/occasions/add']);
  });

  it('should handle delete flow successfully', () => {
    vi.spyOn(occasionsService, 'deleteOccasion').mockReturnValue(of(undefined));
    (component as any).openDeleteDialog(mockOccasionRow);

    expect(component.isDeleteOpen()).toBe(true);

    component.confirmDelete();

    expect(occasionsService.deleteOccasion).toHaveBeenCalledWith('occ-1');
    expect(toastrMock.success).toHaveBeenCalledWith('Occasion deleted successfully.');
    expect(component.isDeleteOpen()).toBe(false);
  });

  it('should handle delete error with toast', () => {
    vi.spyOn(occasionsService, 'deleteOccasion').mockReturnValue(
      throwError(() => ({ error: { message: 'Server error' } })),
    );
    (component as any).openDeleteDialog(mockOccasionRow);

    component.confirmDelete();

    expect(toastrMock.error).toHaveBeenCalledWith('Server error');
    expect(component.deleting()).toBe(false);
  });

  it('should close delete dialog without deleting', () => {
    (component as any).openDeleteDialog(mockOccasionRow);
    expect(component.isDeleteOpen()).toBe(true);

    component.closeDeleteDialog();
    expect(component.isDeleteOpen()).toBe(false);
  });
});
