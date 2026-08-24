import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Notification,
  NotificationsApiResponse,
  NotificationsPaginationMetadata,
  UnreadCountApiResponse,
  UpdateNotificationApiResponse,
} from '../models/notification.model';

export interface PaginatedNotificationsResult {
  data: Notification[];
  metadata: NotificationsPaginationMetadata;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly notificationsUrl = `${environment.apiBaseUrl}/notifications`;

  getNotifications(
    page = 1,
    limit = 20,
  ): Observable<PaginatedNotificationsResult> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get<NotificationsApiResponse>(this.notificationsUrl, { params })
      .pipe(
        take(1),
        map((response) => ({
          data: response.payload?.data ?? [],
          metadata: response.payload?.metadata ?? {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        })),
      );
  }

  getUnreadCount(): Observable<number> {
    return this.http
      .get<UnreadCountApiResponse>(`${this.notificationsUrl}/unread-count`)
      .pipe(
        take(1),
        map((response) => response.payload?.unreadCount ?? 0),
      );
  }

  markAllAsRead(): Observable<void> {
    return this.http
      .patch<void>(`${this.notificationsUrl}/mark-all-read`, {})
      .pipe(take(1));
  }

  updateNotification(
    id: string,
    body: { isRead: boolean },
  ): Observable<Notification> {
    return this.http
      .patch<UpdateNotificationApiResponse>(
        `${this.notificationsUrl}/${id}`,
        body,
      )
      .pipe(
        take(1),
        map((response) => response.payload.notification),
      );
  }

  deleteNotification(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.notificationsUrl}/${id}`)
      .pipe(take(1));
  }

  clearAll(): Observable<void> {
    return this.http
      .delete<void>(`${this.notificationsUrl}/clear-all`)
      .pipe(take(1));
  }
}
