export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CREDIT_CARD';

export interface ApiResponse<TPayload = unknown> {
  status: boolean;
  code: number;
  message?: string;
  payload?: TPayload;
}

export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

export interface OrderDto {
  id?: string;
  orderId?: string;
}

export interface PaymentIntentPayload {
  orderId: string;
}

export interface PaymentIntentDto {
  id?: string;
  paymentIntentId?: string;
  clientSecret?: string;
  checkoutUrl?: string;
  url?: string;
}
