'use client';

import ButtonComp from '@/components/shared/ButtonComp';
import Logo from '@/components/shared/Logo';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/schema/auth';
import { useForgotPasswordMutation } from '@/store/apis/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (isSuccess) {
      router.push('/verify-otp');
    }
  }, [isSuccess, router]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const payload = {
      email: data.email,
    };

    forgotPassword(payload);
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-14">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Forgot Password</h2>
          <p className="text-sm text-slate-500">Enter your email to receive an OTP</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-500">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="you@example.com"
                disabled={isLoading || isSubmitting}
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.email && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </div>
              )}
            </div>
          </div>

          <ButtonComp
            type="submit"
            loading={isLoading || isSubmitting}
            loadingText="Sending..."
            size="lg"
            disabled={isLoading || isSubmitting}
            className="h-11 w-full"
          >
            Send OTP
          </ButtonComp>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Remembered your password?{' '}
          <Link href="/sign-in" className="text-primary font-medium transition hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
