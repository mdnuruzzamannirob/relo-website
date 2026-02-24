export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  type: 'BUYER' | 'SELLER';
  profileImage?: string;
  phone?: string | null;
  location?: string | null;
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
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
