'use client';

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ResetPasswordForm = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/sign-in');
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-16">
      <div className="border-brand-100 w-full max-w-md rounded-xl border p-8 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Reset password</h2>
          <p className="text-sm text-slate-500">Create a new secure password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-slate-500">
              New password
            </label>
            <input
              type="password"
              id="new-password"
              placeholder="Enter new password"
              className="border-brand-100 h-11 w-full rounded-md border px-4 text-sm outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1 block text-sm font-medium text-slate-500"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm new password"
              className="border-brand-100 h-11 w-full rounded-md border px-4 text-sm outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <Button type="submit" size="lg" className="h-11 w-full">
            Reset Password
          </Button>
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
