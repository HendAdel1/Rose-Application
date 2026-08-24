export type NotificationType = 'ORDER' | string;

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsPaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsApiResponse {
  status: boolean;
  code: number;
  payload: {
    data: Notification[];
    metadata: NotificationsPaginationMetadata;
  };
}

export interface UnreadCountApiResponse {
  status: boolean;
  code: number;
  payload: {
    unreadCount: number;
  };
}
