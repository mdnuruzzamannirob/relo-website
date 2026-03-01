import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { baseQuery } from '../baseQuery';
import type {
  OrderListResponse,
  OrderListParams,
  BuyNowRequest,
  BuyNowResponse,
  OrderDepositRequest,
  OrderDepositResponse,
  OrderReceivedRequest,
  OrderReceivedResponse,
  WriteReviewRequest,
  WriteReviewResponse,
  ReviewListResponse,
  ReviewListParams,
} from '@/types/order';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery,
  tagTypes: ['BuyerOrders', 'SellerOrders', 'Reviews'],
  endpoints: (builder) => ({
    // ── Buy Now (buyer) ──
    buyNow: builder.mutation<BuyNowResponse, BuyNowRequest>({
      query: (body) => ({
        url: '/orders/buy-now',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          const msg = error?.error?.data?.message || 'Failed to create order';
          toast.error(msg);
        }
      },
      invalidatesTags: ['BuyerOrders'],
    }),

    // ── Get Buyer Orders ──
    getBuyerOrders: builder.query<OrderListResponse, OrderListParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.set('page', String(params.page));
        if (params?.limit) qp.set('limit', String(params.limit));
        if (params?.status && params.status !== 'ALL') qp.set('status', params.status);
        return { url: `/orders/order-for-buyer?${qp.toString()}`, method: 'GET' };
      },
      providesTags: ['BuyerOrders'],
    }),

    // ── Get Seller Orders ──
    getSellerOrders: builder.query<OrderListResponse, OrderListParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.set('page', String(params.page));
        if (params?.limit) qp.set('limit', String(params.limit));
        if (params?.status && params.status !== 'ALL') qp.set('status', params.status);
        return { url: `/orders/order-for-seller?${qp.toString()}`, method: 'GET' };
      },
      providesTags: ['SellerOrders'],
    }),

    // ── Order Deposit (seller confirms deposit with locker + code) ──
    orderDeposit: builder.mutation<OrderDepositResponse, OrderDepositRequest>({
      query: (body) => ({
        url: '/orders/order-deposit',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Deposit confirmed successfully!');
        } catch (error: any) {
          const msg = error?.error?.data?.message || 'Failed to confirm deposit';
          toast.error(msg);
        }
      },
      invalidatesTags: ['SellerOrders'],
    }),

    // ── Order Received (buyer confirms or declines) ──
    orderReceived: builder.mutation<OrderReceivedResponse, OrderReceivedRequest>({
      query: (body) => ({
        url: '/orders/order-received-for-buyer',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || 'Order updated successfully!');
        } catch (error: any) {
          const msg = error?.error?.data?.message || 'Failed to update order';
          toast.error(msg);
        }
      },
      invalidatesTags: ['BuyerOrders'],
    }),

    // ── Cancel Order (demo — API not yet built on backend) ──
    cancelOrder: builder.mutation<{ success: boolean; message: string }, { orderId: string }>({
      query: ({ orderId }) => ({
        url: '/orders/order-cancel',
        method: 'PUT',
        body: { orderId },
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Order cancelled successfully!');
        } catch (error: any) {
          const msg = error?.error?.data?.message || 'Failed to cancel order';
          toast.error(msg);
        }
      },
      invalidatesTags: ['BuyerOrders', 'SellerOrders'],
    }),

    // ── Write Review (buyer reviews completed order) ──
    writeReview: builder.mutation<WriteReviewResponse, WriteReviewRequest>({
      query: (body) => ({
        url: '/orders/order-review',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || 'Review submitted successfully!');
        } catch (error: any) {
          const msg = error?.error?.data?.message || 'Failed to submit review';
          toast.error(msg);
        }
      },
      invalidatesTags: ['BuyerOrders', 'Reviews'],
    }),

    // ── Get Reviews (buyer gets their reviews, seller gets reviews from buyers) ──
    getReviews: builder.query<ReviewListResponse, ReviewListParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.set('page', String(params.page));
        if (params?.limit) qp.set('limit', String(params.limit));
        return { url: `/orders/order-review?${qp.toString()}`, method: 'GET' };
      },
      providesTags: ['Reviews'],
    }),
  }),
});

export const {
  useBuyNowMutation,
  useGetBuyerOrdersQuery,
  useGetSellerOrdersQuery,
  useOrderDepositMutation,
  useOrderReceivedMutation,
  useCancelOrderMutation,
  useWriteReviewMutation,
  useGetReviewsQuery,
} = orderApi;
