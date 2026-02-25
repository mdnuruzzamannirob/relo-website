import { Product } from './product';

export type OfferStatus =
  | 'PENDING'
  | 'ACCEPT'
  | 'DECLINE'
  | 'COUNTER_OFFER'
  | 'COUNTER_ACCEPT'
  | 'COUNTER_DECLINE';

export interface OfferUser {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Offer {
  id: string;
  amount: number;
  createdAt: string;
  counterAmount?: number | null;
  status: OfferStatus;
  counterMessage?: string | null;
  productUserId: string;
  offererId: string;
  product: Product & {
    category?: {
      id: string;
      title: string;
      slug: string;
    };
  };
  offerer?: OfferUser;
  user?: OfferUser;
}

export interface OfferListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OfferListResponse {
  success: boolean;
  message: string;
  data: {
    meta: OfferListMeta;
    data: [Offer][];
  };
}

export interface OfferListParams {
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}

export interface CreateOfferRequest {
  amount: number;
  productId: string;
}

export interface CreateOfferResponse {
  success: boolean;
  message: string;
  data: Offer;
}

// Seller actions
export interface SellerAcceptRequest {
  offerId: string;
  body: { status: 'ACCEPT' };
}

export interface SellerDeclineRequest {
  offerId: string;
  body: { status: 'DECLINE' };
}

export interface SellerCounterOfferRequest {
  offerId: string;
  body: {
    status: 'COUNTER_OFFER';
    counterAmount: number;
    counterMessage?: string;
  };
}

// Buyer actions on counter offer
export interface BuyerAcceptRequest {
  offerId: string;
  body: { status: 'ACCEPT' };
}

export interface BuyerCounterAcceptRequest {
  offerId: string;
  body: { status: 'COUNTER_ACCEPT' };
}

export interface BuyerCounterDeclineRequest {
  offerId: string;
  body: { status: 'COUNTER_DECLINE' };
}

export type OfferStatusUpdateRequest =
  | SellerAcceptRequest
  | SellerDeclineRequest
  | SellerCounterOfferRequest
  | BuyerAcceptRequest
  | BuyerCounterAcceptRequest
  | BuyerCounterDeclineRequest;

// Response for seller actions (accept/decline/counter) — returns updated Offer
export interface OfferStatusUpdateResponse {
  success: boolean;
  message: string;
  data: Offer;
}

// Response specifically when buyer accepts (ACCEPT / COUNTER_ACCEPT) — returns checkout info
export interface OfferCheckoutResponse {
  success: boolean;
  message: string;
  data: {
    offerAmount: number;
    serviceFee: number;
    totalAmount: number;
    product: {
      id: string;
      brandName?: string;
      photos?: string[];
      price: number;
      title: string;
      category?: { id: string; title: string; slug: string };
      location?: { id: string; title: string; slug: string };
    };
    paymentUrl: string;
  };
}
