// ── Order Status Enum ──
export type OrderStatus = 'PENDING' | 'ACCEPT' | 'DECLINE' | 'CONFIRM' | 'PICKUP' | 'COMPLETE';

// ── Nested types from API response ──
export interface OrderProduct {
  id: string;
  brandName: string;
  photos: string[];
  price: number;
  title: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  location: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface OrderUser {
  id: string;
  name: string;
  profileImage: string;
  lastActive: string | null;
  isOnline: boolean;
}

// ── Single Order (from GET list responses) ──
export interface Order {
  id: string;
  orderId: string;
  amount: number;
  depositCode?: string;
  lockerNumber?: string;
  status: OrderStatus;
  isPayment: boolean;
  isReviewed?: boolean;
  products: OrderProduct;
  seller?: OrderUser;
  buyer?: OrderUser;
  createdAt?: string;
  updatedAt?: string;
}

// ── API Response types ──
export interface OrderListResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      totalPage: number;
    };
    data: Order[];
  };
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: string;
}

// Buy Now Checkout
export interface BuyNowRequest {
  productId: string;
}

export interface BuyNowCheckoutResponse {
  serviceFee: number;
  totalAmount: number;
  product: {
    id: string;
    brandName: string;
    photos: string[];
    price: number;
    title: string;
    category: {
      id: string;
      title: string;
      slug: string;
    };
    location: {
      id: string;
      title: string;
      slug: string;
    };
  };
  paymentUrl: string;
}

export interface BuyNowResponse {
  success: boolean;
  message: string;
  data: BuyNowCheckoutResponse;
}

// Order Deposit (seller confirms deposit)
export interface OrderDepositRequest {
  orderId: string;
  lockerNumber: string;
  depositCode: string;
}

export interface OrderDepositResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Order Received (buyer confirms receipt or declines)
export interface OrderReceivedRequest {
  orderId: string;
  status: 'ACCEPT' | 'DECLINE';
}

export interface OrderReceivedResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// ── Review System ──
export interface WriteReviewRequest {
  orderId: string;
  rating: number;
  review: string;
}

export interface WriteReviewResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface Review {
  id: string;
  rating: number;
  review: string;
  product: {
    id: string;
    brandName: string;
    photos: string[];
    title: string;
    category: {
      id: string;
      title: string;
      slug: string;
    };
    location: {
      id: string;
      title: string;
      slug: string;
    };
  };
  buyer: {
    id: string;
    name: string;
    profileImage: string;
    externalId: string;
  };
  createdAt?: string;
}

export interface ReviewListParams {
  page?: number;
  limit?: number;
}

export interface ReviewListResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
    data: Review[];
  };
}
