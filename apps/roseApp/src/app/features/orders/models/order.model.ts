export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type OrderPaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export type OrderPaymentMethod = 'CASH_ON_DELIVERY' | 'CREDIT_CARD';

export interface OrderItemProduct {
  id: string;
  title: string;
  price: string | number;
  cover?: string;
  image?: string;
  rating?: number;
  ratings?: number;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId?: string;
  quantity: number;
  price: string | number;
  product?: OrderItemProduct;
}

export interface OrderAddress {
  id: string;
  city?: string;
  street?: string;
  phone?: string;
  title?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId?: string;
  addressId?: string;
  paymentMethod?: OrderPaymentMethod | string;
  paymentStatus?: OrderPaymentStatus | string;
  status?: OrderStatus | string;
  totalPrice?: number | string;
  subtotal?: number | string;
  discount?: number | string;
  deliveryFee?: number | string;
  orderItems?: OrderItem[];
  items?: OrderItem[];
  address?: OrderAddress;
  createdAt: string;
  updatedAt?: string;
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus | string;
  paymentStatus?: OrderPaymentStatus | string;
  search?: string;
}

export interface OrdersApiResponse {
  status: boolean;
  code: number;
  message?: string;
  payload?: {
    orders?: Order[];
    data?: Order[];
    total?: number;
    count?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  } | Order[];
}

export interface SingleOrderApiResponse {
  status: boolean;
  code: number;
  message?: string;
  payload?: Order | { order?: Order };
}
