'use client';

import ButtonComp from '@/components/shared/ButtonComp';
import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { signUpSchema, SignUpFormData } from '@/lib/schema/auth';
import { useSignUpMutation } from '@/store/apis/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useController, useWatch } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { getGoogleSignInUrl } from '@/lib/utils/authClient';

const SignUpForm = () => {
  const router = useRouter();

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signUp, { isLoading: isSigningUp, isSuccess }] = useSignUpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const { field: agreeTermsField } = useController({
    name: 'agreeTerms',
    control,
    defaultValue: false,
  });

  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const isLoading = isSigningUp || isSubmitting;

  useEffect(() => {
    if (isSuccess) {
      router.push('/sign-in');
    }
  }, [isSuccess, router]);

  const onSubmit = (data: SignUpFormData) => {
    const payload = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      isAgreement: data.agreeTerms,
    };

    signUp(payload);
  };

  const handleGoogleSignIn = () => {
    if (isLoading) return;
    window.location.href = getGoogleSignInUrl();
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-14">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        {/* Title */}
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Join MarketPlace</h2>
          <p className="text-sm text-slate-500">Create your account to start buying and selling</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-500">
              Full name <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                {...register('fullName')}
                type="text"
                id="fullName"
                placeholder="John Doe"
                disabled={isLoading}
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {errors.fullName && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={14} />
                  {errors.fullName.message}
                </div>
              )}
            </div>
          </div>

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
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-500">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Create a password"
                disabled={isLoading}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 pr-10 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
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

            {/* Password Rules */}
            {isPasswordFocused && (
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <p className={password && /[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  ✓ At least one uppercase letter
                </p>
                <p className={password && /[a-z]/.test(password) ? 'text-green-600' : ''}>
                  ✓ At least one lowercase letter
                </p>
                <p className={password && /[0-9]/.test(password) ? 'text-green-600' : ''}>
                  ✓ At least one number
                </p>
                <p className={password && /[!@#$%^&*]/.test(password) ? 'text-green-600' : ''}>
                  ✓ At least one special character (!@#$%^&*)
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
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
                placeholder="Confirm your password"
                disabled={isLoading}
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 pr-10 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* Terms */}
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-500 select-none">
              <Checkbox
                id="agreeTerms"
                checked={agreeTermsField.value}
                onCheckedChange={agreeTermsField.onChange}
                disabled={isLoading}
                className="size-5"
              />

              <span>
                I agree to the{' '}
                <Link
                  href="/terms-and-condition"
                  className="text-primary font-medium transition hover:underline"
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy-policy"
                  className="text-primary font-medium transition hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {errors.agreeTerms && (
              <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={14} />
                {errors.agreeTerms.message}
              </div>
            )}
          </div>

          {/* Submit */}
          <ButtonComp
            type="submit"
            loading={isLoading}
            loadingText="Signing up..."
            size="lg"
            disabled={isLoading}
            className="h-11 w-full"
          >
            Sign Up
          </ButtonComp>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="bg-brand-100 h-px flex-1" />
          <span className="text-xs text-slate-500">or continue with</span>
          <div className="bg-brand-100 h-px flex-1" />
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full gap-2"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={18}
            height={18}
          />
          Sign Up with Google
        </Button>

        {/* Sign In link */}
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-primary cursor-pointer font-medium transition hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
