'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Order, OrderAction } from '@/app/buyer/my-orders/page';
import { MapPin, Package, Star, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/shared/StatusBadge';

const labelMap: Record<OrderAction, string> = {
  contact: 'Contact Seller',
  cancel: 'Cancel Order',
  qr: 'View QR Code',
  confirm: 'Confirm Receipt',
  review: 'Write Review',
};

const getOrderActions = (order: Order): OrderAction[] => {
  if (order.status === 'processing') return ['contact', 'cancel'];
  if (order.status === 'ready') return ['qr', 'confirm', 'contact'];
  if (order.status === 'completed') return order.isReviewed ? ['contact'] : ['review', 'contact'];
  return [];
};

export default function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState<OrderAction | null>(null);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const actions = getOrderActions(order);

  // --- API Handlers ---
  const handleCancel = async () => {
    setLoading(true);
    // API Call: await fetch('/api/orders/cancel', { ... })
    setLoading(false);
    setOpen(null);
  };

  const handleConfirm = async () => {
    setLoading(true);
    // API Call: await fetch('/api/orders/confirm', { ... })
    setLoading(false);
    setOpen(null);
  };

  const handleSubmitReview = async () => {
    setLoading(true);
    // API Call: await fetch('/api/reviews', { ... })
    setLoading(false);
    setOpen(null);
  };

  const statusBadge = () => {
    switch (order.status) {
      case 'processing':
        return <StatusBadge label="Processing" color="blue" size="sm" />;
      case 'ready':
        return <StatusBadge label="Ready for Pickup" color="orange" size="sm" />;
      case 'completed':
        return <StatusBadge label="Completed" color="green" size="sm" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="border-brand-100 flex gap-4 space-y-4 rounded-xl border bg-white p-4">
        <Image
          src={order.image}
          alt={order.title}
          width={80}
          height={80}
          className="size-20 min-w-20 rounded-md object-cover"
        />
        <div className="flex-1 space-y-4">
          <div className="border-brand-100 flex flex-1 justify-between border-b pb-4">
            <div className="space-y-1">
              <p className="text-primary font-medium">{order.title}</p>
              <p className="text-xs text-slate-500">
                Seller: <span className="text-primary font-medium">{order.seller}</span>
              </p>
              <p className="text-xs text-slate-500">
                Order ID: <span className="text-primary font-medium">{order.orderCode}</span>
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-primary text-lg font-semibold">${order.price}</p>
              {statusBadge()}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Order Date:</p>
              <p className="text-primary text-sm font-medium">{order.orderDate}</p>
            </div>
            {order.completedDate && (
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Completed Date:</p>
                <p className="text-primary text-sm font-medium">{order.completedDate}</p>
              </div>
            )}
          </div>

          {/* Locker info for ready orders */}
          {order.locker && (
            <div className="flex gap-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm">
              <Package className="size-5 text-blue-600" />
              <div className="flex flex-col">
                <h3 className="mb-1.5 font-medium text-blue-600">Ready for Pickup</h3>
                <span className="text-blue-500">{order.locker.name}</span>
                <span className="flex items-center gap-1 text-xs text-blue-500">
                  <MapPin className="size-3" /> {order.locker.address}
                </span>
              </div>
            </div>
          )}

          <div className="flex w-full gap-4">
            {actions.map((action) => (
              <Button
                key={action}
                variant={
                  action === 'confirm' || action === 'review' || action === 'qr'
                    ? 'default'
                    : 'outline'
                }
                className={cn(
                  'flex-1',
                  action === 'confirm'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : action === 'review'
                      ? 'bg-brand-600 hover:bg-brand-700 text-white'
                      : action === 'cancel'
                        ? 'border-red-600 text-red-600 hover:bg-red-50'
                        : '',
                )}
                onClick={() =>
                  action === 'contact' ? router.push('/buyer/messages') : setOpen(action)
                }
              >
                {labelMap[action]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={open === 'review'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-primary text-lg font-semibold">Write a Review</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              {/* Next.js Image used here */}
              <div className="relative size-20 min-w-20 shrink-0 overflow-hidden rounded-lg">
                <Image src={order.image} alt={order.title} fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-primary font-bold">{order.title}</h4>
                <p className="text-xs text-slate-500">Seller: {order.seller}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="mb-1 block text-sm font-medium text-slate-500">Your Rating</p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      'size-8 cursor-pointer transition-all',
                      s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200',
                    )}
                    onClick={() => setRating(s)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="mb-1 block text-sm font-medium text-slate-500">Your Review</p>
              <textarea
                placeholder="Share your experience..."
                className="border-brand-100 focus:bg-brand-50/50 h-11 min-h-30 w-full resize-none rounded-md border p-3 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="h-10 flex-1" onClick={() => setOpen(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} disabled={loading} className="h-10 flex-1">
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Receipt Modal */}
      <Dialog open={open === 'confirm'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-primary text-center text-xl font-semibold">
              Confirm Receipt?
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              Did you successfully receive your item from the locker?
            </p>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-left">
              <div className="flex items-center gap-3">
                <Image
                  src={order.image}
                  alt={order.title}
                  width={40}
                  height={40}
                  className="size-10 shrink-0 overflow-hidden rounded-lg object-cover"
                />

                <div>
                  <p className="text-primary text-sm font-bold">{order.title}</p>
                  <p className="text-[10px] text-slate-500">{order.seller}</p>
                </div>
              </div>
              <p className="text-primary font-bold">${order.price}</p>
            </div>
            <div className="flex gap-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-left">
              <AlertTriangle className="size-4 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                By confirming, you acknowledge that payment will be released to the seller.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="h-10 flex-1" onClick={() => setOpen(null)}>
                Not received
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className="h-10 flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                {loading ? 'Confirming...' : 'Confirm Receipt'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- CANCEL ORDER MODAL --- */}
      <Dialog open={open === 'cancel'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50">
            <Trash2 className="size-10 text-red-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-primary text-center text-xl font-semibold">
              Cancel Order?
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
          </DialogHeader>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setOpen(null)} className="h-10 flex-1">
              No, Keep Order
            </Button>
            <Button
              onClick={handleCancel}
              disabled={loading}
              className="h-10 flex-1 bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? 'Processing...' : 'Yes, Cancel'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
