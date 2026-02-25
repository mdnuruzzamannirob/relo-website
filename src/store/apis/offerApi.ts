import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { baseQuery } from '../baseQuery';
import type {
  OfferListResponse,
  OfferListParams,
  CreateOfferRequest,
  CreateOfferResponse,
  OfferStatusUpdateRequest,
  OfferStatusUpdateResponse,
  OfferCheckoutResponse,
} from '@/types/offer';

export const offerApi = createApi({
  reducerPath: 'offerApi',
  baseQuery,
  tagTypes: ['OfferList'],
  endpoints: (builder) => ({
    // Create offer (buyer → product)
    createOffer: builder.mutation<CreateOfferResponse, CreateOfferRequest>({
      query: (body) => ({
        url: '/orders/offer-create',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Offer sent successfully!');
        } catch (error: any) {
          const msg = error?.error?.data?.message || 'Failed to send offer';
          toast.error(msg);
        }
      },
      invalidatesTags: ['OfferList'],
    }),

    // Get offers list (paginated)
    getOffers: builder.query<OfferListResponse, OfferListParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', String(params.page));
        if (params?.limit) queryParams.set('limit', String(params.limit));
        if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);
        if (params?.searchTerm) queryParams.set('searchTerm', params.searchTerm);
        return {
          url: `/orders/offer-list?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['OfferList'],
    }),

    // Update offer status (accept / decline / counter / counter-accept / counter-decline)
    updateOfferStatus: builder.mutation<OfferStatusUpdateResponse, OfferStatusUpdateRequest>({
      query: ({ offerId, body }) => ({
        url: `/orders/offer-status-update/${offerId}`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Seller actions return Offer with status; buyer accept returns checkout data
          const status = (data?.data as { status?: string })?.status;

          if (status) {
            const messages: Record<string, string> = {
              ACCEPT: 'Offer accepted!',
              DECLINE: 'Offer declined.',
              COUNTER_OFFER: 'Counter offer sent!',
              COUNTER_ACCEPT: 'Counter offer accepted!',
              COUNTER_DECLINE: 'Counter offer declined.',
            };
            toast.success(messages[status] || 'Offer updated!');
          } else {
            // Checkout response — use server message
            toast.success(data?.message || 'Offer updated!');
          }
        } catch (error: any) {
          const msg = error?.error?.data?.message || 'Failed to update offer';
          toast.error(msg);
        }
      },
      invalidatesTags: ['OfferList'],
    }),
  }),
});

export const { useCreateOfferMutation, useGetOffersQuery, useUpdateOfferStatusMutation } = offerApi;
