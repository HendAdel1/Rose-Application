export interface adminStatistics {
  status: boolean
  code: number
  payload: Payload
}

export interface Payload {
  summary: Summary
  categories: Category[]
  orderStatus: OrderStatus
  revenue: Revenue
  topSellingProducts: TopSellingProduct[]
  lowStockProducts: LowStockProduct[]
}

export interface Summary {
  totalProducts: number
  totalOrders: number
  totalCategories: number
  totalRevenue: number
  currency: string
}

export interface Category {
  id: string
  title: string
  productCount: number
}

export interface OrderStatus {
  completed: Completed
  inProgress: InProgress
  canceled: Canceled
  totalOrders: number
}

export interface Completed {
  count: number
  percent: number
}

export interface InProgress {
  count: number
  percent: number
}

export interface Canceled {
  count: number
  percent: number
}

export interface Revenue {
  period: string
  points: Point[]
}

export interface Point {
  period: string
  label: string
  revenue: number
}

export interface TopSellingProduct {
  productId: string
  title: string
  unitPrice: number
  totalSales: number
}

export interface LowStockProduct {
  id: string
  title: string
  stock: number
}
