import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { OccasionsService } from './occasions.service';
import { environment } from '../../../environments/environment';

describe('OccasionsService', () => {
  let service: OccasionsService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/occasions`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OccasionsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(OccasionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch paginated occasions', () => {
    const mockResponse = {
      status: true,
      payload: {
        occasions: [
          { _id: '1', title: 'Wedding', productsCount: 65 },
          { _id: '2', title: 'Graduation', productsCount: 32 },
        ],
        metadata: {
          currentPage: 1,
          totalPages: 2,
          limit: 10,
          totalItems: 20,
        },
      },
    };

    service.getOccasions({ page: 1, limit: 10, search: 'Wed' }).subscribe((result) => {
      expect(result.occasions.length).toBe(2);
      expect(result.occasions[0].title).toBe('Wedding');
      expect(result.occasions[0].id).toBe('1');
      expect(result.metadata.totalItems).toBe(20);
    });

    const req = httpMock.expectOne(`${baseUrl}?page=1&limit=10&search=Wed`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch occasion by id', () => {
    const mockOccasion = {
      _id: '123',
      title: 'Birthday',
      description: 'Birthday gifts',
      image: 'https://example.com/bday.png',
    };

    service.getOccasionById('123').subscribe((res) => {
      expect(res.id).toBe('123');
      expect(res.title).toBe('Birthday');
    });

    const req = httpMock.expectOne(`${baseUrl}/123`);
    expect(req.request.method).toBe('GET');
    req.flush({ payload: { occasion: mockOccasion } });
  });

  it('should create an occasion', () => {
    const newDto = {
      title: 'Anniversary',
      description: 'Anniversary gifts',
      image: 'data:image/png;base64,...',
    };

    service.createOccasion(newDto).subscribe((res) => {
      expect(res.title).toBe('Anniversary');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDto);
    req.flush({ payload: { occasion: { _id: '456', ...newDto } } });
  });

  it('should update an occasion', () => {
    const updateDto = { title: 'Updated Wedding' };

    service.updateOccasion('123', updateDto).subscribe((res) => {
      expect(res.title).toBe('Updated Wedding');
    });

    const req = httpMock.expectOne(`${baseUrl}/123`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ payload: { occasion: { _id: '123', ...updateDto } } });
  });

  it('should delete an occasion', () => {
    service.deleteOccasion('123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
