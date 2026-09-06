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
  successUrl?: string;
  cancelUrl?: string;
}

export interface OrderDto {
  id?: string;
  orderId?: string;
}

export interface CreateOrderResult {
  orderId: string;
  checkoutUrl?: string;
}

export interface CreateOrderResponsePayload {
  order?: OrderDto;
  checkout?: CheckoutSessionDto | null;
}

export interface CheckoutSessionPayload {
  orderId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionDto {
  checkoutUrl: string;
  sessionId: string;
  expiresAt: string;
  reused: boolean;
}

export interface CheckoutSessionStatusDto {
  sessionId?: string;
  paymentStatus?: 'paid' | 'unpaid' | 'no_payment_required';
  sessionStatus?: 'open' | 'complete' | 'expired';
  amountTotal?: number | null;
  currency?: string | null;
  order?: {
    orderId?: string;
    paymentStatus?: string;
  } | null;
}
