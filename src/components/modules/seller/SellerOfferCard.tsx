'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import { useUpdateOfferStatusMutation } from '@/store/apis/offerApi';
import type { Offer } from '@/types/offer';
import Link from 'next/link';

export type OfferAction = 'accept' | 'counter' | 'decline';

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  SOLD: { label: 'Ordered', color: 'bg-purple-100 text-purple-700' },
  ACCEPT: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  DECLINE: { label: 'Declined', color: 'bg-red-100 text-red-700' },
  COUNTER_OFFER: { label: 'Counter Sent', color: 'bg-blue-100 text-blue-700' },
  COUNTER_ACCEPT: { label: 'Counter Accepted', color: 'bg-green-100 text-green-700' },
  COUNTER_DECLINE: { label: 'Counter Declined', color: 'bg-red-100 text-red-700' },
};

export default function SellerOfferCard({ offer }: { offer: Offer }) {
  const [open, setOpen] = useState<OfferAction | null>(null);
  const [counterPrice, setCounterPrice] = useState(offer.amount);
  const [counterMessage, setCounterMessage] = useState('');

  const [updateOfferStatus, { isLoading }] = useUpdateOfferStatusMutation();

  const product = offer.product;
  const buyer = offer.user;
  const productImage = product?.photos?.[0] || '/images/banner.png';
  const offerer = offer.offerer;

  // If product is sold, show "Ordered" regardless of offer status
  const isSold = product?.isSold === true;
  const status = isSold
    ? { label: 'Ordered', color: 'bg-purple-100 text-purple-700' }
    : statusConfig[offer.status] || statusConfig.PENDING;
  const canAct = !isSold && offer.status === 'PENDING';

  const handleAccept = async () => {
    await updateOfferStatus({ offerId: offer.id, body: { status: 'ACCEPT' } });
    setOpen(null);
  };

  const handleDecline = async () => {
    await updateOfferStatus({ offerId: offer.id, body: { status: 'DECLINE' } });
    setOpen(null);
  };

  const handleCounter = async () => {
    await updateOfferStatus({
      offerId: offer.id,
      body: {
        status: 'COUNTER_OFFER',
        counterAmount: counterPrice,
        counterMessage: counterMessage || undefined,
      },
    });
    setOpen(null);
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
                {buyer?.profileImage ? (
                  <Image
                    src={buyer?.profileImage}
                    alt={buyer?.name}
                    width={28}
                    height={28}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-brand-50 flex size-7 min-w-7 items-center justify-center rounded-full text-xs font-semibold">
                    {buyer?.name?.charAt(0) || 'B'}
                  </div>
                )}
                <span className="text-primary text-sm font-medium">{buyer?.name || 'Buyer'}</span>
                <span className="hidden text-slate-300 sm:inline">•</span>
                <span className="text-xs text-slate-400">
                  {new Date(offer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
              <div className="text-left sm:text-right">
                <p className="text-xs font-medium text-slate-400">Original Price</p>
                <p className="text-primary text-base font-semibold line-through sm:text-lg">
                  ${(product?.price ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="from-brand-50 to-brand-100/30 flex items-center justify-between rounded-xl bg-linear-to-r p-4 shadow-sm">
            <span className="text-sm font-semibold text-slate-700 sm:text-base">Offer Amount</span>
            <span className="text-primary text-xl font-bold sm:text-2xl">
              ${offer.amount.toFixed(2)}
            </span>
          </div>

          {offer.status === 'COUNTER_OFFER' && offer.counterAmount && (
            <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
              <span className="text-sm font-semibold text-blue-700">Your Counter</span>
              <div className="text-right">
                <span className="text-xl font-bold text-blue-700">
                  ${offer.counterAmount.toFixed(2)}
                </span>
                {offer.counterMessage && (
                  <p className="mt-1 text-xs text-blue-500">{offer.counterMessage}</p>
                )}
              </div>
            </div>
          )}

          {canAct && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
              <Button
                className="flex-1 bg-green-600 text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
                onClick={() => setOpen('accept')}
              >
                <CheckCircle2 className="mr-2 size-4" />
                Accept Offer
              </Button>

              <Button
                className="flex-1 bg-slate-800 text-white shadow-sm transition-all hover:bg-slate-900 hover:shadow-md"
                onClick={() => setOpen('counter')}
              >
                <MessageSquare className="mr-2 size-4" />
                Counter Offer
              </Button>

              <Link
                href={`/seller/messages${offer.offererId ? `?userId=${offer.offererId}` : ''}`}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <MessageSquare className="mr-2 size-4" />
                  Message Buyer
                </Button>
              </Link>

              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                onClick={() => setOpen('decline')}
              >
                <XCircle className="mr-2 size-4" />
                Decline
              </Button>
            </div>
          )}

          {/* Message button for non-actionable states */}
          {!canAct &&
            !isSold &&
            offer.status !== 'DECLINE' &&
            offer.status !== 'COUNTER_DECLINE' && (
              <Link href={`/seller/messages${offer.offererId ? `?userId=${offer.offererId}` : ''}`}>
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <MessageSquare className="mr-2 size-4" />
                  Message Buyer
                </Button>
              </Link>
            )}
        </div>
      </div>

      {/* ================= ACCEPT MODAL ================= */}
      <Dialog open={open === 'accept'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="size-9 text-green-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-primary text-center text-xl font-semibold">
              Accept this offer?
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              You are about to accept the buyer&apos;s offer of{' '}
              <span className="font-semibold text-slate-800">${offer.amount.toFixed(2)}</span>.
            </p>
          </DialogHeader>

          <div className="flex gap-4">
            <Button variant="outline" className="h-10 flex-1" onClick={() => setOpen(null)}>
              Cancel
            </Button>

            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="h-10 flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Processing…' : 'Yes, Accept'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= DECLINE MODAL ================= */}
      <Dialog open={open === 'decline'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="size-9 text-red-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-primary text-center text-xl font-semibold">
              Decline this offer?
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              The buyer will be notified that you declined this offer.
            </p>
          </DialogHeader>

          <div className="flex gap-4">
            <Button variant="outline" className="h-10 flex-1" onClick={() => setOpen(null)}>
              No, Keep Offer
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isLoading}
              className="h-10 flex-1 bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Processing…' : 'Yes, Decline'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= COUNTER MODAL ================= */}
      <Dialog open={open === 'counter'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-primary text-lg font-semibold">
              Send Counter Offer
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <Image
              src={productImage}
              alt={product?.title || 'Product'}
              width={56}
              height={56}
              className="size-20 min-w-20 rounded-md object-cover"
            />
            <div>
              <p className="font-semibold">{product?.title || 'Product'}</p>
              <p className="text-xs text-slate-500">Buyer: {offerer?.name || 'Buyer'}</p>
              <p className="items-end text-xs text-slate-500">
                Original price:{' '}
                <span className="text-primary font-medium">
                  ${(product?.price ?? 0).toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-500">
                Your Counter Offer
              </label>
              <input
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(+e.target.value)}
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-500">
                Message to Buyer (Optional)
              </label>
              <textarea
                placeholder="Explain your counter offer…"
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                className="border-brand-100 focus:bg-brand-50/50 h-11 min-h-30 w-full resize-none rounded-md border p-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="h-10 flex-1" onClick={() => setOpen(null)}>
                Cancel
              </Button>
              <Button onClick={handleCounter} disabled={isLoading} className="h-10 flex-1">
                {isLoading ? 'Sending…' : 'Send Counter Offer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
