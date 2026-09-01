import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { adminStatistics, Payload } from '../../models/admin-statistics.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private readonly http = inject(HttpClient);
  private readonly adminUrl = `${environment.apiBaseUrl}/admin/statistics`;


  getAllAdminStatistics(revenuePeriod: 'monthly' | 'week' = 'monthly'):Observable<Payload> {
    const params = new HttpParams().set('revenuePeriod', revenuePeriod);
return this.http.get<adminStatistics>(this.adminUrl,{ params }).pipe(
map((res: adminStatistics) => res.payload)
);
}
}
