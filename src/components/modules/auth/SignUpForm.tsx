'use client';

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-16">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        {/* Title */}
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Join MarketPlace</h2>
          <p className="text-sm text-slate-500">Create your account to start buying and selling</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-500">
              Full name
            </label>

            <input
              type="text"
              id="fullName"
              placeholder="John Doe"
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>

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
              placeholder="Create a password"
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-500"
            >
              Confirm password
            </label>

            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>

          {/* Terms */}
          <label className="flex w-fit cursor-pointer items-start gap-2 text-sm text-slate-500 select-none">
            <Checkbox className="border-brand-100 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5" />

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

          {/* Sign Up */}
          <Button type="submit" size="lg" className="h-11 w-full">
            Sign Up
          </Button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="bg-brand-100 h-px flex-1" />
          <span className="text-xs text-slate-500">or continue with</span>
          <div className="bg-brand-100 h-px flex-1" />
        </div>

        {/* Google */}
        <Button variant="outline" className="h-11 w-full gap-2">
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
