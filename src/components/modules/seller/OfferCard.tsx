'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, MessageSquare, AlertTriangle } from 'lucide-react';

export type OfferAction = 'accept' | 'counter' | 'decline';

export type Offer = {
  id: string;
  productName: string;
  productImage: string;
  buyerName: string;
  buyerAvatar: string;
  offeredAt: string;
  originalPrice: number;
  offerAmount: number;
};

export default function OfferCard({ offer }: { offer: Offer }) {
  const [open, setOpen] = useState<OfferAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [counterPrice, setCounterPrice] = useState(offer.offerAmount);

  /* ---------------- API handlers ---------------- */
  const handleAccept = async () => {
    setLoading(true);
    // await fetch('/api/offers/accept', {})
    setLoading(false);
    setOpen(null);
  };

  const handleDecline = async () => {
    setLoading(true);
    // await fetch('/api/offers/decline', {})
    setLoading(false);
    setOpen(null);
  };

  const handleCounter = async () => {
    setLoading(true);
    // await fetch('/api/offers/counter', {})
    setLoading(false);
    setOpen(null);
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:flex-row md:gap-5 md:p-5">
        <Image
          src={offer.productImage}
          alt={offer.productName}
          width={500}
          height={500}
          className="aspect-video w-full rounded-lg object-cover sm:aspect-square sm:h-28 sm:w-28 md:h-24 md:w-24 lg:h-28 lg:w-28"
        />
        <div className="flex-1 space-y-3 md:space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex-1 space-y-1.5">
              <h3 className="text-base font-semibold text-slate-800 sm:text-lg md:text-xl">
                {offer.productName}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <div className="bg-brand-50 size-7 min-w-7 rounded-full sm:size-8 sm:min-w-8"></div>
                <span className="text-primary text-sm font-medium">{offer.buyerName}</span>
                <span className="hidden text-slate-300 sm:inline">•</span>
                <span className="text-xs text-slate-400">{offer.offeredAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
              <div className="text-left sm:text-right">
                <p className="text-xs font-medium text-slate-400">Original Price</p>
                <p className="text-primary text-base font-semibold line-through sm:text-lg">
                  ${offer.originalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="from-brand-50 to-brand-100/30 flex items-center justify-between rounded-xl bg-linear-to-r p-4 shadow-sm">
            <span className="text-sm font-semibold text-slate-700 sm:text-base">Offer Amount</span>
            <span className="text-primary text-xl font-bold sm:text-2xl">
              ${offer.offerAmount.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
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

            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              onClick={() => setOpen('decline')}
            >
              <XCircle className="mr-2 size-4" />
              Decline
            </Button>
          </div>
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
              <span className="font-semibold text-slate-800">${offer.offerAmount.toFixed(2)}</span>.
            </p>
          </DialogHeader>

          <div className="flex gap-4">
            <Button variant="outline" className="h-10 flex-1" onClick={() => setOpen(null)}>
              Cancel
            </Button>

            <Button
              onClick={handleAccept}
              disabled={loading}
              className="h-10 flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Processing…' : 'Yes, Accept'}
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
            </Button>{' '}
            <Button
              onClick={handleDecline}
              disabled={loading}
              className="h-10 flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Processing…' : 'Yes, Decline'}
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
              src={offer.productImage}
              alt={offer.productName}
              width={56}
              height={56}
              className="size-20 min-w-20 rounded-md object-cover"
            />
            <div>
              <p className="font-semibold">{offer.productName}</p>
              <p className="text-xs text-slate-500">Buyer: {offer.buyerName}</p>
              <p className="items-end text-xs text-slate-500">
                Original price:{' '}
                <span className="text-primary font-medium">${offer.originalPrice.toFixed(2)}</span>
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
                className="border-brand-100 focus:bg-brand-50/50 h-11 min-h-30 w-full resize-none rounded-md border p-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="h-10 flex-1" onClick={() => setOpen(null)}>
                Cancel
              </Button>
              <Button onClick={handleCounter} disabled={loading} className="h-10 flex-1">
                {loading ? 'Sending…' : 'Send Counter Offer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
