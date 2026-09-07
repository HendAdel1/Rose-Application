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
    uploadImage: vi.fn().mockReturnValue(of({ url: '/api/upload/temp/mock-uuid' })),
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

    component.form.patchValue({ name: 'Graduation', image: 'test.png' });
    expect(component.form.valid).toBe(true);
  });

  it('should call occasionsService.uploadImage and createOccasion on submit', () => {
    const fixture = TestBed.createComponent(AddOccasion);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const mockFile = new File(['mock'], 'anniversary.png', { type: 'image/png' });
    component.selectedFile.set(mockFile);
    component.form.patchValue({ name: 'Anniversary', image: 'anniversary.png' });
    component.onSubmit();

    expect(occasionsServiceMock.uploadImage).toHaveBeenCalledWith(mockFile);
    expect(occasionsServiceMock.createOccasion).toHaveBeenCalledWith({
      title: 'Anniversary',
      description: 'Anniversary',
      image: '/api/upload/temp/mock-uuid',
    });
    expect(toastrMock.success).toHaveBeenCalled();
  });
});
