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
      <div className="border-brand-100 flex gap-4 space-y-4 rounded-xl border bg-white p-4">
        <Image
          src={offer.productImage}
          alt={offer.productName}
          width={80}
          height={80}
          className="size-20 min-w-20 rounded-md object-cover"
        />
        <div className="flex-1 space-y-4">
          {' '}
          <div className="flex gap-4">
            <div className="flex-1">
              <h3 className="font-semibold">{offer.productName}</h3>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                {/* <Image
                  src={offer.buyerAvatar}
                  alt={''}
                  width={18}
                  height={18}
                  className="bg-brand-50 size-8 min-w-8 rounded-full"
                /> */}
                {/* bg image */}
                <div className="bg-brand-50 size-8 min-w-8 rounded-full"></div>
                <span className="text-primary font-medium">{offer.buyerName}</span>
                <span>•</span>
                <span className="text-xs">{offer.offeredAt}</span>
              </div>
            </div>

            <div className="text-right text-sm">
              <p className="text-xs text-slate-400">Original price</p>
              <p className="text-primary font-semibold line-through">
                ${offer.originalPrice.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="bg-brand-50 text-primary flex items-center justify-between rounded-lg p-3">
            <span className="font-medium">Offer Amount</span>
            <span className="text-lg font-semibold">${offer.offerAmount.toFixed(2)}</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => setOpen('accept')}
            >
              <CheckCircle2 className="mr-2 size-4" />
              Accept Offer
            </Button>

            <Button
              className="flex-1 bg-slate-800 text-white hover:bg-slate-900"
              onClick={() => setOpen('counter')}
            >
              <MessageSquare className="mr-2 size-4" />
              Counter Offer
            </Button>

            <Button
              variant="outline"
              className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
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
