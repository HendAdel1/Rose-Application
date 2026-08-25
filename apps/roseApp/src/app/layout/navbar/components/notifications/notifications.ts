import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Popover } from 'primeng/popover';
import { Menu } from 'primeng/menu';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import {
  LucideCheck,
  LucideCheckCheck,
  LucideTrash2,
  LucideBrushCleaning,
  LucideEllipsisVertical,
  LucideBellOff,
  LucideLoader,
} from '@lucide/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Notification } from './models/notification.model';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-notifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Popover,
    Menu,
    LucideCheck,
    LucideCheckCheck,
    LucideTrash2,
    LucideBrushCleaning,
    LucideEllipsisVertical,
    LucideBellOff,
    LucideLoader,
    TranslatePipe,
    PrimeTemplate,
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  private readonly popover = viewChild.required<Popover>(
    'notificationsPopover',
  );
  private readonly notificationMenu =
    viewChild.required<Menu>('notificationMenu');
  private readonly translate = inject(TranslateService);
  private readonly notificationsService = inject(NotificationsService);

  readonly notifications = signal<Notification[]>([]);
  readonly loading = signal(false);
  readonly unreadCount = this.notificationsService.unreadCount;

  readonly notificationCount = computed(() => this.notifications().length);

  readonly menuItems = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.notificationsService.refreshUnreadCount();
  }

  toggle(event: Event): void {
    this.loadNotifications();
    this.popover().toggle(event);
  }

  markAllAsRead(): void {
    const previousList = this.notifications();
    const previousUnread = this.unreadCount();

    this.notifications.update((list) =>
      list.map((n) => ({ ...n, isRead: true })),
    );
    this.unreadCount.set(0);

    this.notificationsService.markAllAsRead().subscribe({
      error: () => {
        this.notifications.set(previousList);
        this.unreadCount.set(previousUnread);
      },
    });
  }

  clearAll(): void {
    const previousList = this.notifications();
    const previousUnread = this.unreadCount();

    this.notifications.set([]);
    this.unreadCount.set(0);

    this.notificationsService.clearAll().subscribe({
      error: () => {
        this.notifications.set(previousList);
        this.unreadCount.set(previousUnread);
      },
    });
  }

  markAsRead(id: string): void {
    const previousList = this.notifications();
    const previousUnread = this.unreadCount();

    this.notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    this.unreadCount.update((count) => Math.max(0, count - 1));

    this.notificationsService.updateNotification(id, { isRead: true }).subscribe({
      error: () => {
        this.notifications.set(previousList);
        this.unreadCount.set(previousUnread);
      },
    });
  }

  markAsUnread(id: string): void {
    this.notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
    );
    this.unreadCount.update((count) => count + 1);
  }

  deleteNotification(id: string): void {
    const previousList = this.notifications();
    const previousUnread = this.unreadCount();
    const wasUnread = previousList.find((n) => n.id === id && !n.isRead);

    this.notifications.update((list) => list.filter((n) => n.id !== id));
    if (wasUnread) {
      this.unreadCount.update((count) => Math.max(0, count - 1));
    }

    this.notificationsService.deleteNotification(id).subscribe({
      error: () => {
        this.notifications.set(previousList);
        this.unreadCount.set(previousUnread);
      },
    });
  }

  openNotificationMenu(event: Event, notification: Notification): void {
    event.stopPropagation();

    const readLabel = this.translate.instant(
      'NAV.NOTIFICATIONS_PANEL.MARK_AS_READ',
    );
    const deleteLabel = this.translate.instant(
      'NAV.NOTIFICATIONS_PANEL.DELETE',
    );

    const items: MenuItem[] = [
      {
        label: readLabel,
        icon: 'check',
        disabled: notification.isRead,
        command: () => this.markAsRead(notification.id),
      },
      {
        label: deleteLabel,
        icon: 'trash',
        command: () => this.deleteNotification(notification.id),
      },
    ];

    this.menuItems.set(items);
    this.notificationMenu().toggle(event);
  }



  private loadNotifications(): void {
    this.loading.set(true);
    this.notificationsService.getNotifications().subscribe({
      next: (result) => {
        this.notifications.set(result.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}

