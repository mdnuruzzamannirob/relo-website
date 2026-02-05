import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.10.20.2:5007/api/v1';

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage dynamically
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    // Add authorization header if token exists
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');

    return headers;
  },
});
