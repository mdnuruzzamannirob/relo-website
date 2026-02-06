import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { baseQuery } from '../baseQuery';

export type CmsPageKey =
  | 'about-us'
  | 'terms-and-conditions'
  | 'privacy-policy'
  | 'how-it-works'
  | 'help-center'
  | 'selling-guide'
  | 'buying-guide'
  | 'trust-and-safety';

type CmsPageData = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type CmsResponse = {
  success: boolean;
  message: string;
  data: CmsPageData;
};

export const cmsApi = createApi({
  reducerPath: 'cmsApi',
  baseQuery,
  tagTypes: ['CmsPage'],
  endpoints: (builder) => ({
    getCmsPage: builder.query<CmsResponse, CmsPageKey>({
      query: (pageKey) => ({
        url: `/legal/${pageKey}`,
        method: 'GET',
      }),
      async onQueryStarted(pageKey, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to load content';
          toast.error(errorMessage);
        }
      },
      providesTags: (result, error, pageKey) => [{ type: 'CmsPage', id: pageKey }],
    }),
  }),
});

export const { useGetCmsPageQuery } = cmsApi;
