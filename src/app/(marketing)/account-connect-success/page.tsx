import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Account Connection Successful',
  description: 'Your account connection was successful',
};

export default function AccountConnectSuccessPage() {
  return (
    <div className="app-container flex min-h-[calc(100vh-119px)] items-center justify-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-green-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="size-12 text-green-600" />
        </div>

        <h1 className="text-primary mb-2 text-2xl font-bold">Account Connected Successfully!</h1>
        <p className="mb-6 text-sm text-slate-600">
          Your account has been connected successfully. You can now start listing your products and
          manage your sales in the dashboard.
        </p>

        <Link href="/seller/earnings">
          <Button className="h-11 w-full">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
