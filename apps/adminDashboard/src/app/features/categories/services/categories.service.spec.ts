import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CategoriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads categories into signals for the table', () => {
    service.loadCategories(1, 10);

    const req = httpMock.expectOne(
      (request) =>
        request.url.includes('/categories') &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '10',
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      status: true,
      code: 200,
      payload: {
        data: [{ id: '1', title: 'Flowers', _count: { products: 3 } }],
        metadata: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    });

    expect(service.categories()).toEqual([
      expect.objectContaining({ id: '1', name: 'Flowers', products: 3 }),
    ]);
    expect(service.total()).toBe(1);
    expect(service.loading()).toBe(false);
  });

  it('lists categories with pagination metadata', () => {
    let result:
      | { items: { id: string }[]; total: number; page: number; limit: number }
      | undefined;

    service.getCategories(1, 10, 'flow').subscribe((response) => {
      result = response;
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url.includes('/categories') &&
        request.params.get('page') === '1' &&
        request.params.get('search') === 'flow',
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      status: true,
      code: 200,
      payload: {
        data: [{ id: '1', title: 'Flowers' }],
        metadata: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    });

    expect(result).toEqual({
      items: [{ id: '1', title: 'Flowers' }],
      total: 1,
      page: 1,
      limit: 10,
    });
  });

  it('creates a category', () => {
    let createdId = '';

    service
      .createCategory({
        title: 'Gifts',
        description: 'Gift boxes',
        image: '/api/upload/temp/550e8400-e29b-41d4-a716-446655440000',
      })
      .subscribe((category) => {
        createdId = category.id;
      });

    const req = httpMock.expectOne((request) => request.url.endsWith('/categories'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      title: 'Gifts',
      description: 'Gift boxes',
      image: '/api/upload/temp/550e8400-e29b-41d4-a716-446655440000',
    });

    req.flush({
      status: true,
      code: 201,
      payload: { category: { id: 'cat-1', title: 'Gifts' } },
    });

    expect(createdId).toBe('cat-1');
  });

  it('updates and deletes a category', () => {
    service.updateCategory('cat-1', { title: 'Updated' }).subscribe();
    const patch = httpMock.expectOne((request) => request.url.endsWith('/categories/cat-1'));
    expect(patch.request.method).toBe('PATCH');
    patch.flush({ status: true, code: 200, payload: { id: 'cat-1', title: 'Updated' } });

    service.deleteCategory('cat-1').subscribe();
    const del = httpMock.expectOne((request) => request.url.endsWith('/categories/cat-1'));
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
