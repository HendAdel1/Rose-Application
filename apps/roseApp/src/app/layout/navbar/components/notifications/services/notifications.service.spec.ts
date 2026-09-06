import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { EMPTY, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { NotificationsService } from './notifications.service';
import {
  Notification,
  NotificationsApiResponse,
  UnreadCountApiResponse,
  UpdateNotificationApiResponse,
} from '../models/notification.model';

function buildMockNotification(
  overrides: Partial<Notification> = {},
): Notification {
  return {
    id: '1',
    userId: 'u1',
    type: 'ORDER',
    title: 'Order shipped',
    message: 'Your order has been shipped.',
    isRead: false,
    link: '/orders/1',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpMock: HttpTestingController;
  const BASE_URL = `${environment.apiBaseUrl}/notifications`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(NotificationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize unreadCount with 0', () => {
    expect(service.unreadCount()).toBe(0);
  });

  describe('getNotifications', () => {
    const MOCK_RESPONSE: NotificationsApiResponse = {
      status: true,
      code: 200,
      payload: {
        data: [
          buildMockNotification({ id: '1' }),
          buildMockNotification({ id: '2', isRead: true }),
        ],
        metadata: { page: 1, limit: 20, total: 2, totalPages: 1 },
      },
    };

    it('should send GET request with default page and limit params', () => {
      service.getNotifications().subscribe();

      const req = httpMock.expectOne(`${BASE_URL}?page=1&limit=20`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_RESPONSE);
    });

    it('should send GET request with custom page and limit params', () => {
      service.getNotifications(3, 10).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}?page=3&limit=10`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_RESPONSE);
    });

    it('should map response to PaginatedNotificationsResult', () => {
      service.getNotifications().subscribe((result) => {
        expect(result.data.length).toBe(2);
        expect(result.data[0].id).toBe('1');
        expect(result.metadata.total).toBe(2);
        expect(result.metadata.totalPages).toBe(1);
      });

      const req = httpMock.expectOne(`${BASE_URL}?page=1&limit=20`);
      req.flush(MOCK_RESPONSE);
    });

    it('should fallback to empty data when payload is null', () => {
      service.getNotifications().subscribe((result) => {
        expect(result.data).toEqual([]);
        expect(result.metadata).toEqual({
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        });
      });

      const req = httpMock.expectOne(`${BASE_URL}?page=1&limit=20`);
      req.flush({ status: true, code: 200, payload: null });
    });
  });

  describe('getUnreadCount', () => {
    it('should send GET request to unread-count endpoint', () => {
      service.getUnreadCount().subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/unread-count`);
      expect(req.request.method).toBe('GET');
      req.flush({
        status: true,
        code: 200,
        payload: { unreadCount: 5 },
      } as UnreadCountApiResponse);
    });

    it('should map response to unread count number', () => {
      service.getUnreadCount().subscribe((count) => {
        expect(count).toBe(5);
      });

      const req = httpMock.expectOne(`${BASE_URL}/unread-count`);
      req.flush({
        status: true,
        code: 200,
        payload: { unreadCount: 5 },
      } as UnreadCountApiResponse);
    });

    it('should fallback to 0 when payload is null', () => {
      service.getUnreadCount().subscribe((count) => {
        expect(count).toBe(0);
      });

      const req = httpMock.expectOne(`${BASE_URL}/unread-count`);
      req.flush({ status: true, code: 200, payload: null });
    });
  });

  describe('refreshUnreadCount', () => {
    it('should update unreadCount signal with fetched value', () => {
      service.refreshUnreadCount();

      const req = httpMock.expectOne(`${BASE_URL}/unread-count`);
      req.flush({
        status: true,
        code: 200,
        payload: { unreadCount: 7 },
      } as UnreadCountApiResponse);

      expect(service.unreadCount()).toBe(7);
    });

    it('should not update unreadCount when getUnreadCount emits nothing', () => {
      service.unreadCount.set(3);

      vi.spyOn(service, 'getUnreadCount').mockReturnValue(EMPTY);

      service.refreshUnreadCount();

      expect(service.unreadCount()).toBe(3);
    });
  });

  describe('markAllAsRead', () => {
    it('should send PATCH request to mark-all-read endpoint', () => {
      service.markAllAsRead().subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/mark-all-read`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });

  describe('updateNotification', () => {
    const MOCK_UPDATE_RESPONSE: UpdateNotificationApiResponse = {
      status: true,
      code: 200,
      payload: {
        notification: buildMockNotification({ id: 'n1', isRead: true }),
      },
    };

    it('should send PATCH request with notification id and body', () => {
      service.updateNotification('n1', { isRead: true }).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/n1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ isRead: true });
      req.flush(MOCK_UPDATE_RESPONSE);
    });

    it('should map response to the updated Notification', () => {
      service
        .updateNotification('n1', { isRead: true })
        .subscribe((notification) => {
          expect(notification.id).toBe('n1');
          expect(notification.isRead).toBe(true);
        });

      const req = httpMock.expectOne(`${BASE_URL}/n1`);
      req.flush(MOCK_UPDATE_RESPONSE);
    });
  });

  describe('deleteNotification', () => {
    it('should send DELETE request with notification id', () => {
      service.deleteNotification('n1').subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/n1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('clearAll', () => {
    it('should send DELETE request to clear-all endpoint', () => {
      service.clearAll().subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/clear-all`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
