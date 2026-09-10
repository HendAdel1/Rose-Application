import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { OccasionsService } from './occasions.service';

describe('OccasionsService', () => {
  let service: OccasionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OccasionsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(OccasionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads occasions into signals for the table', () => {
    service.loadOccasions(1, 10);

    const req = httpMock.expectOne(
      (request) =>
        request.url.includes('/occasions') &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '10',
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      status: true,
      code: 200,
      payload: {
        data: [{ id: '1', title: 'Birthdays', _count: { products: 5 } }],
        metadata: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    });

    expect(service.occasions()).toEqual([
      expect.objectContaining({ id: '1', name: 'Birthdays', products: 5 }),
    ]);
    expect(service.total()).toBe(1);
    expect(service.loading()).toBe(false);
  });

  it('lists occasions with pagination metadata', () => {
    let result:
      | { items: { id?: string }[]; total: number; page: number; limit: number }
      | undefined;

    service.getOccasions(1, 10, 'birth').subscribe((response) => {
      result = response;
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url.includes('/occasions') &&
        request.params.get('page') === '1' &&
        request.params.get('search') === 'birth',
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      status: true,
      code: 200,
      payload: {
        data: [{ id: '1', title: 'Birthdays' }],
        metadata: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    });

    expect(result).toEqual({
      items: [{ id: '1', title: 'Birthdays' }],
      total: 1,
      page: 1,
      limit: 10,
    });
  });

  it('creates an occasion', () => {
    let createdId = '';

    service
      .createOccasion({
        title: 'Anniversary',
        description: 'Wedding anniversary',
        image: '/api/upload/temp/550e8400-e29b-41d4-a716-446655440000',
      })
      .subscribe((occasion) => {
        createdId = occasion.id || occasion._id || '';
      });

    const req = httpMock.expectOne((request) => request.url.endsWith('/occasions'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      title: 'Anniversary',
      description: 'Wedding anniversary',
      image: '/api/upload/temp/550e8400-e29b-41d4-a716-446655440000',
    });

    req.flush({
      status: true,
      code: 201,
      payload: { occasion: { id: 'occ-1', title: 'Anniversary' } },
    });

    expect(createdId).toBe('occ-1');
  });

  it('updates and deletes an occasion', () => {
    service.updateOccasion('occ-1', { title: 'Updated' }).subscribe();
    const patch = httpMock.expectOne((request) => request.url.endsWith('/occasions/occ-1'));
    expect(patch.request.method).toBe('PATCH');
    patch.flush({ status: true, code: 200, payload: { id: 'occ-1', title: 'Updated' } });

    service.deleteOccasion('occ-1').subscribe();
    const del = httpMock.expectOne((request) => request.url.endsWith('/occasions/occ-1'));
    expect(del.request.method).toBe('DELETE');
    del.flush({ status: true, code: 200 });
  });

  it('uploads an image and resolves relative urls', () => {
    let uploaded = '';

    service.uploadImage(new File(['x'], 'a.png', { type: 'image/png' })).subscribe((url) => {
      uploaded = url;
    });

    const req = httpMock.expectOne((request) => request.url.endsWith('/upload'));
    expect(req.request.method).toBe('POST');
    req.flush({
      status: true,
      code: 201,
      payload: { url: '/api/upload/temp/550e8400-e29b-41d4-a716-446655440000' },
    });

    expect(uploaded).toBe('/api/upload/temp/550e8400-e29b-41d4-a716-446655440000');
    expect(service.resolveImageUrl('/api/upload/temp/x')).toContain('/api/upload/temp/x');
    expect(service.resolveImageUrl('https://cdn/a.png')).toBe('https://cdn/a.png');
  });
});
