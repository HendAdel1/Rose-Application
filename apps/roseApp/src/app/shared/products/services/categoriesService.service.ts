import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import {  Category } from '../../../features/products/interface/Category';

@Injectable({
  providedIn: 'root',
})
export class categoriesService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/categories?page=1&limit=20`;

  getCategories() :Observable<Category[]> {
    return this.httpClient.get<Category[] >(this.apiUrl).pipe(
      map((res: any) => res.payload?.data)
    );
  }

}
