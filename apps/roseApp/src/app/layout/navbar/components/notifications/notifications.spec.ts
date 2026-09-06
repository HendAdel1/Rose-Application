import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';
import { vi, type Mock } from 'vitest';
import { TranslateService } from '@ngx-translate/core';
import { Notifications } from './notifications';
import { NotificationsService } from './services/notifications.service';
import { Notification } from './models/notification.model';

interface MockNotificationsService {
  refreshUnreadCount: Mock;
  getNotifications: Mock;
  markAllAsRead: Mock;
  clearAll: Mock;
  updateNotification: Mock;
  deleteNotification: Mock;
  unreadCount: WritableSignal<number>;
}

interface MockTranslateService {
  instant: Mock;
}

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

describe('Notifications', () => {
  let component: Notifications;
  let fixture: ComponentFixture<Notifications>;
  let mockNotificationsService: MockNotificationsService;
  let mockTranslateService: MockTranslateService;

  const MOCK_NOTIFICATIONS: Notification[] = [
    buildMockNotification({ id: '1', isRead: false }),
    buildMockNotification({ id: '2', isRead: true, title: 'Order delivered' }),
    buildMockNotification({ id: '3', isRead: false, title: 'New promo' }),
  ];

  beforeEach(async () => {
    const unreadCountSignal = signal(2);

    mockNotificationsService = {
      refreshUnreadCount: vi.fn(),
      getNotifications: vi
        .fn()
        .mockReturnValue(
          of({
            data: MOCK_NOTIFICATIONS,
            metadata: { page: 1, limit: 20, total: 3, totalPages: 1 },
          }),
        ),
      markAllAsRead: vi.fn().mockReturnValue(of(void 0)),
      clearAll: vi.fn().mockReturnValue(of(void 0)),
      updateNotification: vi
        .fn()
        .mockReturnValue(of(buildMockNotification({ id: '1', isRead: true }))),
      deleteNotification: vi.fn().mockReturnValue(of(void 0)),
      unreadCount: unreadCountSignal,
    };

    mockTranslateService = {
      instant: vi.fn().mockImplementation((key: string) => key),
    };

    await TestBed.configureTestingModule({
      imports: [Notifications],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    })
      .overrideComponent(Notifications, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Notifications);
    component = fixture.componentInstance;
  });

  describe('Component creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty notifications', () => {
      expect(component.notifications()).toEqual([]);
    });

    it('should initialize with loading = false', () => {
      expect(component.loading()).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should call refreshUnreadCount on init', () => {
      component.ngOnInit();

      expect(mockNotificationsService.refreshUnreadCount).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('markAllAsRead', () => {
    beforeEach(() => {
      component.notifications.set([...MOCK_NOTIFICATIONS]);
      mockNotificationsService.unreadCount.set(2);
    });

    it('should optimistically mark all notifications as read', () => {
      component.markAllAsRead();

      const allRead = component.notifications().every((n) => n.isRead);
      expect(allRead).toBe(true);
    });

    it('should set unreadCount to 0', () => {
      component.markAllAsRead();

      expect(component.unreadCount()).toBe(0);
    });

    it('should call service.markAllAsRead', () => {
      component.markAllAsRead();

      expect(mockNotificationsService.markAllAsRead).toHaveBeenCalledTimes(1);
    });

    it('should rollback on error', () => {
      const errorSubject = new Subject<void>();
      mockNotificationsService.markAllAsRead.mockReturnValue(errorSubject);

      component.markAllAsRead();
      errorSubject.error(new Error('API error'));

      const unreadNotifications = component
        .notifications()
        .filter((n) => !n.isRead);
      expect(unreadNotifications.length).toBe(2);
      expect(component.unreadCount()).toBe(2);
    });
  });

  describe('clearAll', () => {
    beforeEach(() => {
      component.notifications.set([...MOCK_NOTIFICATIONS]);
      mockNotificationsService.unreadCount.set(2);
    });

    it('should optimistically clear all notifications', () => {
      component.clearAll();

      expect(component.notifications()).toEqual([]);
    });

    it('should set unreadCount to 0', () => {
      component.clearAll();

      expect(component.unreadCount()).toBe(0);
    });

    it('should call service.clearAll', () => {
      component.clearAll();

      expect(mockNotificationsService.clearAll).toHaveBeenCalledTimes(1);
    });

    it('should rollback on error', () => {
      const errorSubject = new Subject<void>();
      mockNotificationsService.clearAll.mockReturnValue(errorSubject);

      component.clearAll();
      errorSubject.error(new Error('API error'));

      expect(component.notifications().length).toBe(3);
      expect(component.unreadCount()).toBe(2);
    });
  });

  describe('markAsRead', () => {
    beforeEach(() => {
      component.notifications.set([...MOCK_NOTIFICATIONS]);
      mockNotificationsService.unreadCount.set(2);
    });

    it('should do nothing if id does not exist', () => {
      component.markAsRead('non-existent');

      expect(
        mockNotificationsService.updateNotification,
      ).not.toHaveBeenCalled();
    });

    it('should do nothing if notification is already read', () => {
      component.markAsRead('2');

      expect(
        mockNotificationsService.updateNotification,
      ).not.toHaveBeenCalled();
    });

    it('should optimistically mark the notification as read', () => {
      component.markAsRead('1');

      const target = component.notifications().find((n) => n.id === '1');
      expect(target?.isRead).toBe(true);
    });

    it('should decrement unreadCount by 1', () => {
      component.markAsRead('1');

      expect(component.unreadCount()).toBe(1);
    });

    it('should call service.updateNotification with correct params', () => {
      component.markAsRead('1');

      expect(mockNotificationsService.updateNotification).toHaveBeenCalledWith(
        '1',
        {
          isRead: true,
        },
      );
    });

    it('should rollback on error', () => {
      const errorSubject = new Subject<Notification>();
      mockNotificationsService.updateNotification.mockReturnValue(errorSubject);

      component.markAsRead('1');
      errorSubject.error(new Error('API error'));

      const target = component.notifications().find((n) => n.id === '1');
      expect(target?.isRead).toBe(false);
      expect(component.unreadCount()).toBe(2);
    });

    it('should not let unreadCount go below 0', () => {
      mockNotificationsService.unreadCount.set(0);
      component.notifications.set([
        buildMockNotification({ id: '10', isRead: false }),
      ]);

      component.markAsRead('10');

      expect(component.unreadCount()).toBe(0);
    });
  });

  describe('markAsUnread', () => {
    beforeEach(() => {
      component.notifications.set([
        buildMockNotification({ id: '1', isRead: true }),
      ]);
      mockNotificationsService.unreadCount.set(0);
    });

    it('should mark the notification as unread', () => {
      component.markAsUnread('1');

      const target = component.notifications().find((n) => n.id === '1');
      expect(target?.isRead).toBe(false);
    });

    it('should increment unreadCount by 1', () => {
      component.markAsUnread('1');

      expect(component.unreadCount()).toBe(1);
    });
  });

  describe('deleteNotification', () => {
    beforeEach(() => {
      component.notifications.set([...MOCK_NOTIFICATIONS]);
      mockNotificationsService.unreadCount.set(2);
    });

    it('should optimistically remove the notification', () => {
      component.deleteNotification('1');

      const found = component.notifications().find((n) => n.id === '1');
      expect(found).toBeUndefined();
      expect(component.notifications().length).toBe(2);
    });

    it('should decrement unreadCount when deleting an unread notification', () => {
      component.deleteNotification('1');

      expect(component.unreadCount()).toBe(1);
    });

    it('should NOT change unreadCount when deleting a read notification', () => {
      component.deleteNotification('2');

      expect(component.unreadCount()).toBe(2);
    });

    it('should call service.deleteNotification with correct id', () => {
      component.deleteNotification('1');

      expect(mockNotificationsService.deleteNotification).toHaveBeenCalledWith(
        '1',
      );
    });

    it('should rollback on error', () => {
      const errorSubject = new Subject<void>();
      mockNotificationsService.deleteNotification.mockReturnValue(errorSubject);

      component.deleteNotification('1');
      errorSubject.error(new Error('API error'));

      expect(component.notifications().length).toBe(3);
      expect(component.unreadCount()).toBe(2);
    });
  });

  describe('openNotificationMenu', () => {
    let mockEvent: Event;
    const mockMenuToggle = vi.fn();

    beforeEach(() => {
      mockEvent = {
        stopPropagation: vi.fn(),
      } as unknown as Event;

      // Mock the private viewChild.required<Menu> to avoid NG0951
      (component as Record<string, unknown>)['notificationMenu'] = signal({
        toggle: mockMenuToggle,
      });
    });

    it('should stop event propagation', () => {
      const notification = buildMockNotification();

      component.openNotificationMenu(mockEvent, notification);

      expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should set menuItems with read and delete actions', () => {
      const notification = buildMockNotification();

      component.openNotificationMenu(mockEvent, notification);

      const items = component.menuItems();
      expect(items.length).toBe(2);
      expect(items[0].label).toBe('NAV.NOTIFICATIONS_PANEL.MARK_AS_READ');
      expect(items[1].label).toBe('NAV.NOTIFICATIONS_PANEL.DELETE');
    });

    it('should disable "Mark as Read" when notification is already read', () => {
      const notification = buildMockNotification({ isRead: true });

      component.openNotificationMenu(mockEvent, notification);

      expect(component.menuItems()[0].disabled).toBe(true);
    });

    it('should enable "Mark as Read" when notification is unread', () => {
      const notification = buildMockNotification({ isRead: false });

      component.openNotificationMenu(mockEvent, notification);

      expect(component.menuItems()[0].disabled).toBe(false);
    });

    it('should call markAsRead when read command is executed', () => {
      const notification = buildMockNotification({ id: '1', isRead: false });
      component.notifications.set([notification]);
      mockNotificationsService.unreadCount.set(1);

      component.openNotificationMenu(mockEvent, notification);

      const readCommand = component.menuItems()[0].command;
      readCommand?.({} as never);

      expect(mockNotificationsService.updateNotification).toHaveBeenCalledWith(
        '1',
        {
          isRead: true,
        },
      );
    });

    it('should call deleteNotification when delete command is executed', () => {
      const notification = buildMockNotification({ id: '1' });
      component.notifications.set([notification]);

      component.openNotificationMenu(mockEvent, notification);

      const deleteCommand = component.menuItems()[1].command;
      deleteCommand?.({} as never);

      expect(mockNotificationsService.deleteNotification).toHaveBeenCalledWith(
        '1',
      );
    });
  });

  describe('notificationCount', () => {
    it('should return 0 when there are no notifications', () => {
      expect(component.notificationCount()).toBe(0);
    });

    it('should reflect the current notifications length', () => {
      component.notifications.set([...MOCK_NOTIFICATIONS]);

      expect(component.notificationCount()).toBe(3);
    });

    it('should update when notifications change', () => {
      component.notifications.set([...MOCK_NOTIFICATIONS]);
      expect(component.notificationCount()).toBe(3);

      component.notifications.update((list) =>
        list.filter((n) => n.id !== '1'),
      );
      expect(component.notificationCount()).toBe(2);
    });
  });

  describe('displayUnreadCount', () => {
    it('should display exact count when <= 99', () => {
      mockNotificationsService.unreadCount.set(7);
      expect(component.displayUnreadCount()).toBe('7');

      mockNotificationsService.unreadCount.set(99);
      expect(component.displayUnreadCount()).toBe('99');
    });

    it('should display +99 when count exceeds 99', () => {
      mockNotificationsService.unreadCount.set(100);
      expect(component.displayUnreadCount()).toBe('+99');

      mockNotificationsService.unreadCount.set(150);
      expect(component.displayUnreadCount()).toBe('+99');
    });
  });
});

