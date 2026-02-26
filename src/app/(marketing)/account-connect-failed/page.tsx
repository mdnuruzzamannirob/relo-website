import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Account Connection Failed',
  description: 'Your account connection was failed',
};

export default function AccountConnectFailedPage() {
  return (
    <div className="app-container flex min-h-[calc(100vh-119px)] items-center justify-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-red-50">
          <XCircle className="size-12 text-red-600" />
        </div>

        <h1 className="text-primary mb-2 text-2xl font-bold">Account Connection Failed</h1>
        <p className="mb-6 text-sm text-slate-600">
          We were unable to connect your account. Please try again or contact support if the issue
          persists.
        </p>

        <Link href="/seller/earnings">
          <Button className="h-11 w-full">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
