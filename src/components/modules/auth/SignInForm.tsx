'use client';

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import Link from 'next/link';

const SignInForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-16">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        {/* Logo */}

        {/* Title */}
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-slate-500">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-500">
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-500">
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2 text-slate-500 select-none">
              <Checkbox
                id="remember"
                className="border-brand-100 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span>Remember me</span>
            </label>

            {/* Forgot password */}
            <Link
              href="/forgot-password"
              className="text-primary font-medium transition hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In */}
          <Button type="submit" size="lg" className="h-11 w-full">
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="bg-brand-100 h-px flex-1" />
          <span className="text-xs text-slate-500">or continue with</span>
          <div className="bg-brand-100 h-px flex-1" />
        </div>

        {/* Google */}
        <Button variant="outline" className="h-11 w-full">
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={18}
            height={18}
          />
          Sign In with Google
        </Button>

        {/* Register */}
        <p className="mt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="text-primary cursor-pointer font-medium transition hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
