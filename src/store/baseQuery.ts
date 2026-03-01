import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://relo-ecommerce-backend.vercel.app/api/v1';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set('ngrok-skip-browser-warning', 'true');

    // Get token from localStorage dynamically
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    // Add authorization header if token exists
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // For FormData, we need to ensure Content-Type is not set so browser can set it with boundary
  if (typeof args !== 'string' && args.body instanceof FormData) {
    const result = await rawBaseQuery(args, api, extraOptions);
    return result;
  }

  // For regular requests, ensure Content-Type is set to application/json
  const adjustedArgs =
    typeof args === 'string'
      ? args
      : {
          ...args,
          headers: {
            ...args.headers,
            'Content-Type': 'application/json',
          },
        };

  return rawBaseQuery(adjustedArgs, api, extraOptions);
};
