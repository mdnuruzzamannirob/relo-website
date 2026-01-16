'use client';

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ForgotPasswordForm = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/verify-otp');
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-16">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Forgot password</h2>
          <p className="text-sm text-slate-500">Enter your email to receive an OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-500">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <Button type="submit" size="lg" className="h-11 w-full">
            Send OTP
          </Button>
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
