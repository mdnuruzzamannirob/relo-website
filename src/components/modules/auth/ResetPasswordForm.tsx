'use client';

import ButtonComp from '@/components/shared/ButtonComp';
import Logo from '@/components/shared/Logo';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/schema/auth';
import { useResetPasswordMutation } from '@/store/apis/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const newPassword = useWatch({
    control,
    name: 'newPassword',
    defaultValue: '',
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetPasswordEmail');
    const storedOTP = sessionStorage.getItem('resetPasswordOTP');

    if (!storedEmail || !storedOTP) {
      router.push('/forgot-password');
      return;
    }

    setEmail(storedEmail);
    setOtp(storedOTP);
  }, [router]);

  useEffect(() => {
    if (isSuccess) {
      router.push('/sign-in');
    }
  }, [isSuccess, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email || !otp) return;

    const payload = {
      email,
      password: data.newPassword,
    };
    resetPassword(payload);
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-14">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Reset Password</h2>
          <p className="text-sm text-slate-500">Create a new secure password</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-slate-500">
              New password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('newPassword')}
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                placeholder="Enter new password"
                disabled={isLoading || isSubmitting}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {/* toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-2.5 p-1 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {errors.newPassword && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={14} />
                  {errors.newPassword.message}
                </div>
              )}
            </div>

            {isPasswordFocused && (
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <p className={newPassword && /[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                  ✓ At least one uppercase letter
                </p>
                <p className={newPassword && /[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                  ✓ At least one lowercase letter
                </p>
                <p className={newPassword && /[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                  ✓ At least one number
                </p>
                <p
                  className={newPassword && /[!@#$%^&*]/.test(newPassword) ? 'text-green-600' : ''}
                >
                  ✓ At least one special character (!@#$%^&*)
                </p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-500"
            >
              Confirm password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm new password"
                disabled={isLoading || isSubmitting}
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {/* toggle */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-2.5 right-2.5 p-1 text-slate-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {errors.confirmPassword && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={14} />
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>

          <ButtonComp
            type="submit"
            loading={isLoading || isSubmitting}
            loadingText="Resetting..."
            size="lg"
            disabled={isLoading || isSubmitting}
            className="h-11 w-full"
          >
            Reset Password
          </ButtonComp>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Back to{' '}
          <Link href="/sign-in" className="text-primary font-medium transition hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
