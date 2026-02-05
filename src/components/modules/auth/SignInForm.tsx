'use client';

import ButtonComp from '@/components/shared/ButtonComp';
import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { signInSchema, SignInFormData } from '@/lib/schema/auth';
import { useSignInMutation } from '@/store/apis/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const SignInForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [signIn, { isLoading: isSigningIn, isSuccess }] = useSignInMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const isLoading = isSigningIn || isSubmitting;

  useEffect(() => {
    if (isSuccess) {
      router.push('/');
    }
  }, [isSuccess, router]);

  const onSubmit = (data: SignInFormData) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    signIn(payload);
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-14">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        {/* Title */}
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Welcome Back</h2>
          <p className="text-sm text-slate-500">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
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
                disabled={isLoading}
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

          {/* Password */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-500">
                Password <span className="text-red-500">*</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-primary text-xs font-medium transition hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                disabled={isLoading}
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

              {errors.password && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>

          {/* Sign In */}
          <ButtonComp
            type="submit"
            loading={isLoading}
            loadingText="Signing in..."
            size="lg"
            disabled={isLoading}
            className="h-11 w-full"
          >
            Sign In
          </ButtonComp>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="bg-brand-100 h-px flex-1" />
          <span className="text-xs text-slate-500">or continue with</span>
          <div className="bg-brand-100 h-px flex-1" />
        </div>

        {/* Google */}
        <Button variant="outline" className="h-11 w-full gap-2" disabled={isLoading}>
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={18}
            height={18}
          />
          Sign In with Google
        </Button>

        {/* Sign Up link */}
        <p className="mt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="text-primary cursor-pointer font-medium transition hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
