'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useBuyNowMutation } from '@/store/apis/orderApi';
import { useAuth } from '@/hooks/useAuth';
import type { BuyNowCheckoutResponse } from '@/types/order';

export default function CheckoutOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const { isAuthenticated } = useAuth();
  const [buyNow, { isLoading: isBuyingNow }] = useBuyNowMutation();

  const [orderData, setOrderData] = useState<BuyNowCheckoutResponse | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [error, setError] = useState('');

  // ✅ Guards to prevent duplicate calls (StrictMode/dev + param/auth jitter)
  const lastFetchedProductIdRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);
  const redirectedRef = useRef(false);

  const extractErrorMessage = (err: any) => {
    // RTK Query unwrap error commonly: err?.data?.message
    return (
      err?.data?.message || err?.error?.data?.message || err?.message || 'Failed to load order'
    );
  };

  const fetchOrder = useCallback(
    async (pid: string, { force }: { force?: boolean } = {}) => {
      // Prevent parallel calls
      if (inFlightRef.current) return;

      // Prevent re-fetching same productId unless forced (Try again)
      if (!force && lastFetchedProductIdRef.current === pid) return;

      inFlightRef.current = true;
      lastFetchedProductIdRef.current = pid;

      setIsLoadingOrder(true);
      setError('');

      try {
        const res = await buyNow({ productId: pid }).unwrap();
        setOrderData(res.data);
      } catch (err: any) {
        setError(extractErrorMessage(err));
      } finally {
        setIsLoadingOrder(false);
        inFlightRef.current = false;
      }
    },
    [buyNow],
  );

  // ── Fetch order on mount ──
  useEffect(() => {
    // Auth gate: redirect only once (avoid loops)
    if (!isAuthenticated) {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        router.push('/sign-in');
      }
      return;
    }

    // Param gate
    if (!productId) {
      setError('Product not found.');
      return;
    }

    // Normal fetch (deduped by guards)
    fetchOrder(productId);
  }, [productId, isAuthenticated, fetchOrder, router]);

  // ── Handle payment ──
  const handlePayment = () => {
    if (orderData?.paymentUrl) {
      window.location.href = orderData.paymentUrl;
    }
  };

  const product = orderData?.product;
  const photo = product?.photos?.[0] || '/images/banner.png';

  return (
    <div className="app-container min-h-[calc(100vh-119px)] py-8 pb-14">
      {/* Back */}
      <Link href="/" className="mb-6 block w-fit">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
      </Link>

      {/* Error */}
      {error && !isLoadingOrder && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          <p>{error}</p>
          <button
            onClick={() => {
              if (productId) {
                // Force refetch for retry
                fetchOrder(productId, { force: true });
              }
            }}
            className="rounded-md bg-red-100 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoadingOrder && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Product */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoadingOrder && !error && orderData && product && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT: Product Details */}
          <div className="space-y-4">
            <div className="border-brand-100 rounded-xl border bg-white p-4">
              <Image
                src={photo}
                alt={product.title}
                width={500}
                height={500}
                className="aspect-square w-full rounded-lg object-cover"
              />

              <div className="mt-4 space-y-2">
                <p className="text-primary text-lg font-semibold">{product.title}</p>

                <p className="text-sm text-slate-500">
                  Brand: <span className="text-primary font-medium">{product.brandName}</span>
                </p>

                {product.category && (
                  <p className="text-sm text-slate-500">
                    Category:{' '}
                    <span className="text-primary font-medium">{product.category.title}</span>
                  </p>
                )}

                {product.location && (
                  <p className="text-sm text-slate-500">
                    Location:{' '}
                    <span className="text-primary font-medium">{product.location.title}</span>
                  </p>
                )}

                <div className="border-brand-100 mt-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">Price</span>
                    <span className="text-primary text-xl font-semibold">${product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="border-brand-100 h-fit space-y-4 rounded-xl border bg-white p-6">
            <div>
              <h2 className="text-primary text-xl font-semibold">Order Summary</h2>
              <p className="text-xs text-slate-500">Review your order before payment</p>
            </div>

            {/* Summary table */}
            <div className="border-brand-100 space-y-3 border-y py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="text-primary font-medium">${product.price}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Service Fee</span>
                <span className="text-primary font-medium">${orderData.serviceFee}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-primary font-semibold">Total Amount</span>
              <span className="text-primary text-2xl font-bold">${orderData.totalAmount}</span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm">
              <span className="text-blue-600">ℹ</span>
              <span className="text-blue-600">
                You will be redirected to Stripe for secure payment
              </span>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isBuyingNow}
              className="h-12 w-full text-base font-semibold"
            >
              {isBuyingNow ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>

            {/* Continue Shopping */}
            <Button variant="outline" onClick={() => router.push('/')} className="h-11 w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
