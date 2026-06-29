import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { Testimonial, TestimonialsApiResponse } from '../models/testimonial.model';

@Injectable({ providedIn: 'root' })
export class TestimonialsApiService {
  private readonly http = inject(HttpClient);

  getTestimonials(): Observable<Testimonial[]> {
    const params = new HttpParams({
      fromObject: { page: '1', limit: '20' },
    });

    return this.http
      .get<TestimonialsApiResponse>(`${environment.apiRoot}/testimonials`, { params })
      .pipe(
        map(({ payload }) =>
          (payload?.data ?? []).map((item) => ({
            id: item.id,
            customerName: item.name,
            rating: item.rating,
            comment: item.content,
            createdAt: item.createdAt,
            avatarUrl: item.image,
          })),
        ),
      );
  }
}
