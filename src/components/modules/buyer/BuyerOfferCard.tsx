'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  Lock,
  ExternalLink,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { useUpdateOfferStatusMutation } from '@/store/apis/offerApi';
import type { Offer, OfferCheckoutResponse } from '@/types/offer';
import Link from 'next/link';

type ModalState = 'checkout' | 'decline' | null;

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  SOLD: { label: 'Ordered', color: 'bg-purple-100 text-purple-700' },
  ACCEPT: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  DECLINE: { label: 'Declined', color: 'bg-red-100 text-red-700' },
  COUNTER_OFFER: { label: 'Counter Received', color: 'bg-blue-100 text-blue-700' },
  COUNTER_ACCEPT: { label: 'Counter Accepted', color: 'bg-green-100 text-green-700' },
  COUNTER_DECLINE: { label: 'Counter Declined', color: 'bg-red-100 text-red-700' },
};

export default function BuyerOfferCard({ offer }: { offer: Offer }) {
  const [modal, setModal] = useState<ModalState>(null);
  const [checkoutData, setCheckoutData] = useState<OfferCheckoutResponse['data'] | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [updateOfferStatus, { isLoading: isDeclining }] = useUpdateOfferStatusMutation();

  const product = offer.product;
  const productImage = product?.photos?.[0] || '/images/banner.png';
  const seller = offer.user;

  // If product is sold, show "Ordered" regardless of offer status
  const isSold = product?.isSold === true;
  const status = isSold
    ? { label: 'Ordered', color: 'bg-purple-100 text-purple-700' }
    : statusConfig[offer.status] || statusConfig.PENDING;

  // Buyer can act when seller accepted or sent counter (but NOT if already sold/ordered)
  const canRespondToCounter = !isSold && offer.status === 'COUNTER_OFFER';
  const canPay = !isSold && offer.status === 'ACCEPT';
  const canAct = canRespondToCounter || canPay;

  // Accept -> PUT call -> checkout popup with response data
  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      // Seller accepted -> buyer sends ACCEPT; Seller counter -> buyer sends COUNTER_ACCEPT
      const result = canRespondToCounter
        ? await updateOfferStatus({
            offerId: offer.id,
            body: { status: 'COUNTER_ACCEPT' },
          }).unwrap()
        : await updateOfferStatus({
            offerId: offer.id,
            body: { status: 'ACCEPT' },
          }).unwrap();

      // Store checkout response (offerAmount, serviceFee, totalAmount, product, paymentUrl)
      setCheckoutData(result.data as unknown as OfferCheckoutResponse['data']);
      setModal('checkout');
    } catch {
      // error toast handled in API
    } finally {
      setIsAccepting(false);
    }
  };

  // Decline
  const handleDecline = async () => {
    await updateOfferStatus({ offerId: offer.id, body: { status: 'COUNTER_DECLINE' } });
    setModal(null);
  };

  // Redirect to Stripe payment URL from server response
  const handlePayment = () => {
    if (checkoutData?.paymentUrl) {
      setIsRedirecting(true);
      window.location.href = checkoutData.paymentUrl;
    }
  };

  // Use real response data for checkout popup
  const checkoutProduct = checkoutData?.product || product;
  const checkoutImage = checkoutProduct?.photos?.[0] || '/images/banner.png';

  return (
    <>
      {/* CARD */}
      <div className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:flex-row md:gap-5 md:p-5">
        <Image
          src={productImage}
          alt={product?.title || 'Product'}
          width={500}
          height={500}
          className="aspect-video w-full rounded-lg object-cover sm:aspect-square sm:h-28 sm:w-28 md:h-24 md:w-24 lg:h-28 lg:w-28"
        />

        <div className="flex-1 space-y-3 md:space-y-4">
          {/* Header */}
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
                <span className="hidden text-slate-300 sm:inline">&bull;</span>
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

          {/* Action Buttons */}
          {canAct && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {/* Accept / Pay — directly calls PUT, on success shows checkout popup */}
              <Button
                className="flex-1 bg-green-600 text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
                onClick={handleAccept}
                disabled={isAccepting}
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing&hellip;
                  </>
                ) : canRespondToCounter ? (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    Accept &amp; Pay (${(offer.counterAmount ?? offer.amount).toFixed(2)})
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 size-4" />
                    Proceed to Payment (${offer.amount.toFixed(2)})
                  </>
                )}
              </Button>

              {/* Message Seller */}
              <Link href="/buyer/messages" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <MessageSquare className="mr-2 size-4" />
                  Message Seller
                </Button>
              </Link>

              {/* Decline */}
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                onClick={() => setModal('decline')}
              >
                <XCircle className="mr-2 size-4" />
                Decline
              </Button>
            </div>
          )}

          {/* Message button for non-actionable states (not declined/ordered) */}
          {!canAct &&
            !isSold &&
            offer.status !== 'DECLINE' &&
            offer.status !== 'COUNTER_DECLINE' && (
              <Link href="/buyer/messages">
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <MessageSquare className="mr-2 size-4" />
                  Message Seller
                </Button>
              </Link>
            )}
        </div>
      </div>

      {/* DECLINE CONFIRMATION */}
      <Dialog open={modal === 'decline'} onOpenChange={() => setModal(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="size-9 text-red-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-primary text-center text-xl font-semibold">
              {canRespondToCounter ? 'Decline counter offer?' : 'Decline this offer?'}
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              {canRespondToCounter ? (
                <>
                  The seller&apos;s counter offer of{' '}
                  <span className="font-semibold text-slate-800">
                    ${(offer.counterAmount ?? offer.amount).toFixed(2)}
                  </span>{' '}
                  will be declined.
                </>
              ) : (
                <>This accepted offer will be declined and the deal will be cancelled.</>
              )}
            </p>
          </DialogHeader>

          <div className="flex gap-4">
            <Button variant="outline" className="h-10 flex-1" onClick={() => setModal(null)}>
              No, Keep
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isDeclining}
              className="h-10 flex-1 bg-red-600 hover:bg-red-700"
            >
              {isDeclining ? 'Processing\u2026' : 'Yes, Decline'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CHECKOUT POPUP — shown AFTER PUT response with product details, payment info, paymentUrl */}
      <Dialog open={modal === 'checkout'} onOpenChange={() => setModal(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-0">
          <DialogHeader className="border-b p-6 pb-4">
            <DialogTitle className="text-primary flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="size-5" />
              Complete Payment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 p-6">
            {/* Product Info from response */}
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <Image
                src={checkoutImage}
                alt={checkoutProduct?.title || 'Product'}
                width={80}
                height={80}
                className="size-20 min-w-20 rounded-lg object-cover"
              />
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">
                  {checkoutProduct?.title || 'Product'}
                </p>
                {checkoutProduct?.brandName && (
                  <p className="text-xs text-slate-500">
                    Brand: <span className="font-medium">{checkoutProduct.brandName}</span>
                  </p>
                )}
                {checkoutProduct?.category && (
                  <p className="text-xs text-slate-500">
                    Category: <span className="font-medium">{checkoutProduct.category.title}</span>
                  </p>
                )}
                {'location' in checkoutProduct && (checkoutProduct as any).location && (
                  <p className="text-xs text-slate-500">
                    Location:{' '}
                    <span className="font-medium">{(checkoutProduct as any).location.title}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Payment Breakdown from server response */}
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Original price</span>
                <span className="text-slate-400 line-through">
                  ${(checkoutProduct?.price ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Offer amount</span>
                <span className="font-medium text-slate-800">
                  ${(checkoutData?.offerAmount ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${(checkoutData?.serviceFee ?? 0).toFixed(2)}</span>
              </div>
              <div className="border-brand-100 flex justify-between border-t pt-2 text-base font-semibold text-slate-800">
                <span>Total</span>
                <span>${(checkoutData?.totalAmount ?? 0).toFixed(2)}</span>
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

            {/* Proceed / Cancel */}
            <div className="flex gap-3">
              <Button variant="outline" className="h-11 flex-1" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button
                className="h-11 flex-1"
                onClick={handlePayment}
                disabled={!checkoutData?.paymentUrl || isRedirecting}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Redirecting&hellip;
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 size-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
