export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface OTPResponse {
  otpId: string;
  expiresIn: number;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
