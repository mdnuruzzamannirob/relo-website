'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import OrderConfirmedModal from './OrderConfirmedModal';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProductDetailsQuery } from '@/store/apis/productApi';

export default function CheckoutFrom() {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || '';
  const { data, isLoading, isError, refetch } = useGetProductDetailsQuery(productId, {
    skip: !productId,
  });

  const product = data?.data;
  const productImage = product?.photos?.[0] || '/images/banner.png';
  const productPrice = product?.price ?? 0;
  const serviceFee = product ? 5 : 0;
  const total = productPrice + serviceFee;

  return (
    <div className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      {/* Back */}
      {/* <Link
        href="/"
        className="hover:text-primary mb-6 inline-flex items-center gap-2 text-sm text-slate-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link> */}
      <Link href="/" className="mb-6 block w-fit">
        <Button>
          <ArrowLeft className="mr-1 size-4" />
          Back
        </Button>
      </Link>

      <h1 className="text-primary mb-6 text-2xl font-semibold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-2">
          {/* Payment Method */}
          <div className="border-brand-100 rounded-xl border p-6">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="text-primary h-5 w-5" />
              <h2 className="text-primary font-semibold">Payment Method</h2>
            </div>

            {/* Stripe */}
            <div className="border-brand-100 mb-4 flex items-center justify-between rounded-lg border p-3">
              <span className="text-primary flex items-center gap-2 text-sm font-medium">
                <Image
                  alt="stripe icon"
                  src="/icons/stripe.png"
                  width={50}
                  height={25}
                  className="w-auto"
                />{' '}
                Stripe Payment
              </span>
              <input type="radio" checked readOnly />
            </div>

            {/* Card Fields */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="card-number"
                  className="mb-1 block text-sm font-medium text-slate-500"
                >
                  Card Number
                </label>
                <input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="mb-1 block text-sm font-medium text-slate-500">
                    Expiry Date
                  </label>
                  <input
                    placeholder="MM / YY"
                    id="expiry"
                    className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="mb-1 block text-sm font-medium text-slate-500">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    placeholder="123"
                    className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Buyer Protection */}
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-blue-500">
              <Lock className="size-6" />
              <div className="space-y-0.5 text-xs text-blue-500">
                <h3 className="text-base font-medium text-blue-600">Buyer Protection</h3>
                <p>Your payment is held securely until you confirm item receipt.</p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="border-brand-100 w-full rounded-lg border p-6">
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
          </div>
        </div>

        {/* RIGHT */}
        <div className="border-brand-100 h-fit rounded-xl border p-6">
          <h2 className="text-primary mb-4 font-semibold">Order Summary</h2>

          {!productId && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              No product selected for checkout.
            </div>
          )}

          {isLoading && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-20 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}

          {isError && productId && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <p>Failed to load order summary.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !isError && product && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <Image
                  src={productImage}
                  alt={product.title}
                  width={56}
                  height={56}
                  className="size-20 min-w-20 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{product.title}</p>
                  <p className="text-xs text-slate-500">
                    Size: <span className="font-medium">{product.size || 'N/A'}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Condition: <span className="font-medium">{product.condition || 'N/A'}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex justify-between">
                  <span>Item price</span>
                  <span>${productPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-brand-100 my-4 flex justify-between border-t pt-4 font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button className="w-full" onClick={() => setOrderSuccess(true)}>
                Place Order
              </Button>

              <p className="mt-3 text-center text-xs text-slate-500">
                You won&apos;t be charged until the seller ships the item.
              </p>
            </>
          )}
        </div>
      </div>

      <OrderConfirmedModal open={orderSuccess} onOpenChange={setOrderSuccess} />
    </div>
  );
}
