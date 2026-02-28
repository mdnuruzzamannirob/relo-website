import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { baseQuery } from '../baseQuery';
import type {
  MyEarningsResponse,
  PayoutRequestResponse,
  PayoutHistoryResponse,
  PayoutHistoryParams,
} from '@/types/earnings';

export const earningsApi = createApi({
  reducerPath: 'earningsApi',
  baseQuery,
  tagTypes: ['Earnings', 'PayoutHistory'],
  endpoints: (builder) => ({
    // ── GET /users/my-earnings ────────────────────────────────────────────────
    getMyEarnings: builder.query<MyEarningsResponse, void>({
      query: () => ({ url: '/users/my-earnings', method: 'GET' }),
      providesTags: ['Earnings'],
    }),

    // ── POST /users/payout-request ───────────────────────────────────────────
    requestPayout: builder.mutation<PayoutRequestResponse, void>({
      query: () => ({ url: '/users/payout-request', method: 'POST' }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message || 'Payout request submitted!');
        } catch (error: any) {
          const msg = error?.error?.data?.message || 'Failed to request payout';
          toast.error(msg);
        }
      },
      invalidatesTags: ['Earnings', 'PayoutHistory'],
    }),

    // ── GET /users/payout-history ────────────────────────────────────────────
    getPayoutHistory: builder.query<PayoutHistoryResponse, PayoutHistoryParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.set('page', String(params.page));
        if (params?.limit) qp.set('limit', String(params.limit));
        return { url: `/users/payout-history?${qp.toString()}`, method: 'GET' };
      },
      providesTags: ['PayoutHistory'],
    }),
  }),
});

export const { useGetMyEarningsQuery, useRequestPayoutMutation, useGetPayoutHistoryQuery } =
  earningsApi;
