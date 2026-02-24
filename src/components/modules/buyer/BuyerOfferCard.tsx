'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, AlertTriangle, CreditCard, Lock, ExternalLink } from 'lucide-react';
import { useUpdateOfferStatusMutation } from '@/store/apis/offerApi';
import type { Offer } from '@/types/offer';

type BuyerAction = 'accept' | 'decline' | 'checkout';

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  ACCEPT: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  DECLINE: { label: 'Declined', color: 'bg-red-100 text-red-700' },
  COUNTER_OFFER: { label: 'Counter Received', color: 'bg-blue-100 text-blue-700' },
  COUNTER_ACCEPT: { label: 'Counter Accepted', color: 'bg-green-100 text-green-700' },
  COUNTER_DECLINE: { label: 'Counter Declined', color: 'bg-red-100 text-red-700' },
};

export default function BuyerOfferCard({ offer }: { offer: Offer }) {
  const [open, setOpen] = useState<BuyerAction | null>(null);
  const [updateOfferStatus, { isLoading }] = useUpdateOfferStatusMutation();

  const product = offer.product;
  const productImage = product?.photos?.[0] || '/images/banner.png';
  const seller = offer.productUser;
  const status = statusConfig[offer.status] || statusConfig.PENDING;

  // Buyer can respond to COUNTER_OFFER
  const canRespondToCounter = offer.status === 'COUNTER_OFFER';
  // Buyer's offer was accepted → can proceed to payment
  const canPay = offer.status === 'ACCEPT';

  const paymentAmount = canPay ? offer.amount : offer.counterAmount || offer.amount;
  const serviceFee = 5;
  const total = paymentAmount + serviceFee;

  const handleCounterAccept = async () => {
    await updateOfferStatus({ offerId: offer.id, body: { status: 'COUNTER_ACCEPT' } });
    setOpen(null);
    // After accepting counter, show checkout
    setOpen('checkout');
  };

  const handleCounterDecline = async () => {
    await updateOfferStatus({ offerId: offer.id, body: { status: 'COUNTER_DECLINE' } });
    setOpen(null);
  };

  const handlePayment = () => {
    // Redirect to checkout page with offer context
    window.location.href = `/checkout?productId=${product?.id}&offerId=${offer.id}&amount=${paymentAmount}`;
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:flex-row md:gap-5 md:p-5">
        <Image
          src={productImage}
          alt={product?.title || 'Product'}
          width={500}
          height={500}
          className="aspect-video w-full rounded-lg object-cover sm:aspect-square sm:h-28 sm:w-28 md:h-24 md:w-24 lg:h-28 lg:w-28"
        />
        <div className="flex-1 space-y-3 md:space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-800 sm:text-lg md:text-xl">
                  {product?.title || 'Product'}
                </h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                {seller?.profileImage ? (
                  <Image
                    src={seller.profileImage}
                    alt={seller.name}
                    width={28}
                    height={28}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-brand-50 flex size-7 min-w-7 items-center justify-center rounded-full text-xs font-semibold">
                    {seller?.name?.charAt(0) || 'S'}
                  </div>
                )}
                <span className="text-primary text-sm font-medium">{seller?.name || 'Seller'}</span>
                <span className="hidden text-slate-300 sm:inline">•</span>
                <span className="text-xs text-slate-400">
                  {new Date(offer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
              <div className="text-left sm:text-right">
                <p className="text-xs font-medium text-slate-400">Product Price</p>
                <p className="text-primary text-base font-semibold sm:text-lg">
                  ${(product?.price ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Your Offer */}
          <div className="from-brand-50 to-brand-100/30 flex items-center justify-between rounded-xl bg-linear-to-r p-4 shadow-sm">
            <span className="text-sm font-semibold text-slate-700 sm:text-base">Your Offer</span>
            <span className="text-primary text-xl font-bold sm:text-2xl">
              ${offer.amount.toFixed(2)}
            </span>
          </div>

          {/* Counter Offer from seller */}
          {(offer.status === 'COUNTER_OFFER' ||
            offer.status === 'COUNTER_ACCEPT' ||
            offer.status === 'COUNTER_DECLINE') &&
            offer.counterAmount && (
              <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
                <div>
                  <span className="text-sm font-semibold text-blue-700">
                    Seller&apos;s Counter Offer
                  </span>
                  {offer.counterMessage && (
                    <p className="mt-1 text-xs text-blue-500">
                      &ldquo;{offer.counterMessage}&rdquo;
                    </p>
                  )}
                </div>
                <span className="text-xl font-bold text-blue-700">
                  ${offer.counterAmount.toFixed(2)}
                </span>
              </div>
            )}

          {/* Actions for counter offer */}
          {canRespondToCounter && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              <Button
                className="flex-1 bg-green-600 text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
                onClick={() => setOpen('accept')}
              >
                <CheckCircle2 className="mr-2 size-4" />
                Accept Counter (${offer.counterAmount?.toFixed(2)})
              </Button>

              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                onClick={() => setOpen('decline')}
              >
                <XCircle className="mr-2 size-4" />
                Decline Counter
              </Button>
            </div>
          )}

          {/* Payment button for accepted offer */}
          {canPay && (
            <Button
              className="w-full bg-green-600 text-white hover:bg-green-700"
              onClick={() => setOpen('checkout')}
            >
              <CreditCard className="mr-2 size-4" />
              Proceed to Payment (${offer.amount.toFixed(2)})
            </Button>
          )}
        </div>
      </div>

      {/* ================= ACCEPT COUNTER MODAL ================= */}
      <Dialog open={open === 'accept'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="size-9 text-green-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-primary text-center text-xl font-semibold">
              Accept counter offer?
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              You are accepting the seller&apos;s counter offer of{' '}
              <span className="font-semibold text-slate-800">
                ${offer.counterAmount?.toFixed(2)}
              </span>
              . You will be redirected to complete payment.
            </p>
          </DialogHeader>

          <div className="flex gap-4">
            <Button variant="outline" className="h-10 flex-1" onClick={() => setOpen(null)}>
              Cancel
            </Button>

            <Button
              onClick={handleCounterAccept}
              disabled={isLoading}
              className="h-10 flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Processing…' : 'Accept & Pay'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= DECLINE COUNTER MODAL ================= */}
      <Dialog open={open === 'decline'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="size-9 text-red-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-primary text-center text-xl font-semibold">
              Decline counter offer?
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              The seller&apos;s counter offer of{' '}
              <span className="font-semibold text-slate-800">
                ${offer.counterAmount?.toFixed(2)}
              </span>{' '}
              will be declined.
            </p>
          </DialogHeader>

          <div className="flex gap-4">
            <Button variant="outline" className="h-10 flex-1" onClick={() => setOpen(null)}>
              No, Keep
            </Button>
            <Button
              onClick={handleCounterDecline}
              disabled={isLoading}
              className="h-10 flex-1 bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Processing…' : 'Yes, Decline'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= CHECKOUT POPUP ================= */}
      <Dialog open={open === 'checkout'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-0">
          <DialogHeader className="border-b p-6 pb-4">
            <DialogTitle className="text-primary flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="size-5" />
              Complete Payment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 p-6">
            {/* Product Info */}
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <Image
                src={productImage}
                alt={product?.title || 'Product'}
                width={80}
                height={80}
                className="size-20 min-w-20 rounded-lg object-cover"
              />
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">{product?.title || 'Product'}</p>
                {product?.size && (
                  <p className="text-xs text-slate-500">
                    Size: <span className="font-medium">{product.size}</span>
                  </p>
                )}
                {product?.condition && (
                  <p className="text-xs text-slate-500">
                    Condition: <span className="font-medium">{product.condition}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Original price</span>
                <span className="text-slate-400 line-through">
                  ${(product?.price ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Agreed price</span>
                <span className="font-medium">${paymentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="border-brand-100 flex justify-between border-t pt-2 text-base font-semibold text-slate-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Buyer Protection */}
            <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
              <Lock className="size-5 text-blue-500" />
              <div className="text-xs text-blue-500">
                <p className="text-sm font-medium text-blue-600">Buyer Protection</p>
                <p>Your payment is held securely until you confirm item receipt.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="h-11 flex-1" onClick={() => setOpen(null)}>
                Cancel
              </Button>
              <Button className="h-11 flex-1" onClick={handlePayment}>
                <ExternalLink className="mr-2 size-4" />
                Proceed to Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
