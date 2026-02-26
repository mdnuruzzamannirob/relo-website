import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Payment Successful',
  description: 'Your order has been placed successfully',
};

export default function PaymentSuccessPage() {
  return (
    <div className="app-container flex min-h-[calc(100vh-119px)] items-center justify-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-green-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="size-12 text-green-600" />
        </div>

        <h1 className="text-primary mb-2 text-2xl font-bold">Payment Successful!</h1>
        <p className="mb-6 text-sm text-slate-600">Your order has been placed successfully.</p>

        {/* <div className="mb-6 space-y-2 rounded-lg bg-slate-50 p-4 text-left text-sm">
          <p className="text-slate-600">
            Order confirmation has been sent to your email. You can track your order status in your
            dashboard.
          </p>
          <p className="mt-3 text-slate-600">
            <span className="font-medium text-slate-900">Estimated delivery:</span> 3-5 business
            days
          </p>
        </div> */}

        <div className="flex flex-col gap-3">
          <Link href="/buyer/my-orders">
            <Button className="h-11 w-full">View My Orders</Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="h-11 w-full">
              View Other Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
