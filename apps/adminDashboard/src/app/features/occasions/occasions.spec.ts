import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Occasions } from './occasions';
import { OccasionsService } from './services/occasions.service';

describe('Occasions', () => {
  const toastrMock = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const mockOccasions = [
    { id: '1', title: 'Wedding', productsCount: 65 },
    { id: '2', title: 'Graduation', productsCount: 32 },
  ];

  const occasionsServiceMock = {
    getOccasions: vi.fn().mockReturnValue(
      of({
        occasions: mockOccasions,
        metadata: { currentPage: 1, totalPages: 1, limit: 10, totalItems: 2 },
      }),
    ),
    deleteOccasion: vi.fn().mockReturnValue(of(null)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Occasions],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        { provide: ToastrService, useValue: toastrMock },
        { provide: OccasionsService, useValue: occasionsServiceMock },
      ],
    }).compileComponents();
  });

  it('should create and load occasions on init', () => {
    const fixture = TestBed.createComponent(Occasions);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(occasionsServiceMock.getOccasions).toHaveBeenCalled();
    expect(fixture.componentInstance.occasions().length).toBe(2);
  });

  it('should render table rows for occasions', () => {
    const fixture = TestBed.createComponent(Occasions);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Wedding');
    expect(compiled.textContent).toContain('Graduation');
  });

  it('should handle search input change and reload data', () => {
    const fixture = TestBed.createComponent(Occasions);
    fixture.detectChanges();

    fixture.componentInstance.searchControl.setValue('Wed');
    expect(fixture.componentInstance.searchControl.value).toBe('Wed');
  });

  it('should open and confirm delete dialog', () => {
    const fixture = TestBed.createComponent(Occasions);
    fixture.detectChanges();

    const occasion = mockOccasions[0];
    fixture.componentInstance.openDeleteDialog(occasion);

    expect(fixture.componentInstance.deleteDialogOpen()).toBe(true);
    expect(fixture.componentInstance.occasionToDelete()).toEqual(occasion);

    fixture.componentInstance.confirmDelete();
    expect(occasionsServiceMock.deleteOccasion).toHaveBeenCalledWith('1');
    expect(toastrMock.success).toHaveBeenCalled();
  });
});
