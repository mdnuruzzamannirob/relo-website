import { createApi } from '@reduxjs/toolkit/query/react';
import { User, OTPResponse, ResetPasswordRequest } from '@/types/auth';
import { toast } from 'sonner';
import { clearUser, setUser } from '../slices/userSlice';
import { baseQuery } from '../baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
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

          if (data.token) {
            localStorage.setItem('authToken', data.token);
          }

          dispatch(setUser(data?.userData));
          localStorage.setItem('userData', JSON.stringify(data.userData));

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
          localStorage.setItem('userData', JSON.stringify(data));
        } catch (error: any) {}
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
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          sessionStorage.setItem('forgotPasswordEmail', args.email);

          toast.success('OTP sent to your email');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to send OTP';
          toast.error(errorMessage);
        }
      },
    }),

    resendOtp: builder.mutation<{ success: boolean; message: string }, { email: string }>({
      query: (body) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          sessionStorage.setItem('forgotPasswordEmail', args.email);

          toast.success('OTP resent to your email');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to resend OTP';
          toast.error(errorMessage);
        }
      },
    }),

    // Verify OTP
    verifyOTP: builder.mutation<{ success: boolean }, { email: string; verificationCode: string }>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (!data?.success) {
            throw new Error('Invalid OTP. Please try again.');
          }

          sessionStorage.setItem('resetPasswordEmail', args?.email);
          sessionStorage.setItem('resetPasswordOTP', args?.verificationCode);

          toast.success('OTP verified successfully');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'OTP verification failed';
          toast.error(errorMessage);
        }
      },
    }),

    // Reset Password
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;

          sessionStorage.removeItem('forgotPasswordEmail');
          sessionStorage.removeItem('resetPasswordEmail');
          sessionStorage.removeItem('resetPasswordOTP');

          toast.success('Password reset successfully');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Password reset failed';
          toast.error(errorMessage);
        }
      },
    }),

    // Change Password
    changePassword: builder.mutation<
      { success: boolean; message: string },
      { oldPassword: string; newPassword: string; confirmNewPassword: string }
    >({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Password changed successfully!');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to change password';
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ['User'],
    }),

    // Profile Image Upload
    profileImage: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          id: string;
          name: string;
          email: string;
          profileImageId: string;
          profileImage: string;
          createdAt: string;
          updatedAt: string;
        };
      },
      FormData
    >({
      query: (formData) => ({
        url: '/users/profile-image',
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setUser(data as any));
          localStorage.setItem('userData', JSON.stringify(data));
          toast.success('Profile image updated successfully!');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to update profile image';
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ['User'],
    }),

    // Profile Update
    profileUpdate: builder.mutation<
      {
        success: boolean;
        message: string;
        data: User;
      },
      FormData
    >({
      query: (formData) => ({
        url: '/users/profile-update',
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setUser(data));
          localStorage.setItem('userData', JSON.stringify(data));
          toast.success('Profile updated successfully!');
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 'Failed to update profile';
          toast.error(errorMessage);
        }
      },
      invalidatesTags: ['User'],
    }),

    // switch user role type
    switchUser: builder.mutation<
      { success: boolean; message: string; data: { type: string } },
      void
    >({
      query: () => ({
        url: '/auth/switch-role',
        method: 'PUT',
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

          // Clear all auth-related state and storage
          dispatch(clearUser());
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          sessionStorage.clear();

          // Clear user cache
          dispatch(authApi.util.resetApiState());

          toast.success('Logged out successfully');
        } catch (error: any) {
          // Even if logout fails on backend, clear local state
          dispatch(clearUser());
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          sessionStorage.clear();
          dispatch(authApi.util.resetApiState());

          const errorMessage = error?.error?.data?.message || 'Logged out successfully';
          toast.success(errorMessage);
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
  useResendOtpMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useSwitchUserMutation,
  useProfileImageMutation,
  useProfileUpdateMutation,
} = authApi;
