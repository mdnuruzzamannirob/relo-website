import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Payment Failed',
  description: 'Your payment was failed',
};

export default function PaymentFailedPage() {
  return (
    <div className="app-container flex min-h-[calc(100vh-119px)] items-center justify-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-red-50">
          <XCircle className="size-12 text-red-600" />
        </div>

        <h1 className="text-primary mb-2 text-2xl font-bold">Payment Failed</h1>
        <p className="mb-6 text-sm text-slate-600">
          Your payment was failed. Your order was not placed.
        </p>

        <div className="mb-6 rounded-lg border border-amber-100 bg-amber-50 p-4 text-left text-sm">
          <p className="text-amber-800">
            💡 <span className="font-medium">No charges were made</span> to your account.
          </p>
          <p className="mt-2 text-amber-700">You can try the payment again.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="h-11 w-full">Return to Home</Button>
          </Link>

          <Link href="/buyer/overview">
            <Button variant="outline" className="h-11 w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
