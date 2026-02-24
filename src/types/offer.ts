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
  productUser?: OfferUser;
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
  | BuyerCounterAcceptRequest
  | BuyerCounterDeclineRequest;

export interface OfferStatusUpdateResponse {
  success: boolean;
  message: string;
  data: Offer;
}
