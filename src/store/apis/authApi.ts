import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AuthResponse,
  User,
  OTPResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/types/auth';
import { toast } from 'sonner';
import { setUser } from '../slices/userSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.10.20.2:5007/api/v1';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Sign Up
    signUp: builder.mutation<
      { success: boolean; message: string },
      {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        isAgreement: boolean;
      }
    >({
      query: (credentials) => ({
        url: '/users/register',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Registration successful! Please sign in.');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Something went wrong';
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ['User'],
    }),

    // Sign In
    signIn: builder.mutation<
      { success: boolean; message: string; data: { userData: User; token: string } },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          dispatch(setUser(data?.userData));

          if (data.token) {
            localStorage.setItem('authToken', data.token);
          }

          toast.success('Sign in successful!');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Something went wrong';
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ['User'],
    }),

    // Get Current User
    getMe: builder.query<{ success: boolean; message: string; data: User }, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error: any) {
          console.log(error);
        }
      },
      providesTags: ['User'],
    }),

    // Forgot Password - Send OTP
    forgotPassword: builder.mutation<OTPResponse, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // Verify OTP
    verifyOTP: builder.mutation<{ valid: boolean }, { email: string; otp: string }>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // Change Password
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // Logout
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          // Clear user cache
          dispatch(authApi.util.resetApiState());
        } catch (error) {
          // Handle error
        }
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
