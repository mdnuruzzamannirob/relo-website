'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Package, Star, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/shared/StatusBadge';
import { OrderAction, Order } from '@/types';

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

  const handleCancel = async () => {
    setLoading(true);
    setLoading(false);
    setOpen(null);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setLoading(false);
    setOpen(null);
  };

  const handleSubmitReview = async () => {
    setLoading(true);
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
      {/* CARD */}
      <div className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
        <Image
          src={order.image}
          alt={order.title}
          width={500}
          height={500}
          className="aspect-video w-full rounded-md object-cover sm:h-20 sm:w-20"
        />

        <div className="flex-1 space-y-4">
          {/* HEADER */}
          <div className="border-brand-100 flex flex-col gap-2 border-b pb-4 sm:flex-row sm:justify-between">
            <div className="space-y-1">
              <p className="text-primary font-medium">{order.title}</p>
              <p className="text-xs text-slate-500">
                Seller: <span className="text-primary font-medium">{order.seller}</span>
              </p>
              <p className="text-xs text-slate-500">
                Order ID: <span className="text-primary font-medium">{order.orderCode}</span>
              </p>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
              <p className="text-primary text-lg font-semibold">${order.price}</p>
              {statusBadge()}
            </div>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Order Date</p>
              <p className="text-primary text-sm font-medium">{order.orderDate}</p>
            </div>

            {order.completedDate && (
              <div>
                <p className="text-xs text-slate-500">Completed Date</p>
                <p className="text-primary text-sm font-medium">{order.completedDate}</p>
              </div>
            )}
          </div>

          {/* LOCKER INFO */}
          {order.locker && (
            <div className="flex gap-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm">
              <Package className="size-5 text-blue-600" />
              <div>
                <p className="mb-1 font-medium text-blue-600">Ready for Pickup</p>
                <p className="text-blue-500">{order.locker.name}</p>
                <p className="flex items-center gap-1 text-xs text-blue-500">
                  <MapPin className="size-3" /> {order.locker.address}
                </p>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {actions.map((action) => (
              <Button
                key={action}
                variant={
                  action === 'confirm' || action === 'review' || action === 'qr'
                    ? 'default'
                    : 'outline'
                }
                className={cn(
                  'w-full',
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

      {/* REVIEW MODAL */}
      <Dialog open={open === 'review'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-4 sm:p-6">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
              <div className="relative size-20 overflow-hidden rounded-lg">
                <Image src={order.image} alt={order.title} fill className="object-cover" />
              </div>
              <div>
                <p className="font-bold">{order.title}</p>
                <p className="text-xs text-slate-500">{order.seller}</p>
              </div>
            </div>

            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    'size-8 cursor-pointer',
                    s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300',
                  )}
                  onClick={() => setRating(s)}
                />
              ))}
            </div>

            <textarea
              placeholder="Share your experience..."
              className="h-28 w-full resize-none rounded-md border p-3 text-sm outline-none"
            />

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSubmitReview} disabled={loading}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRM MODAL */}
      <Dialog open={open === 'confirm'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-4 text-center sm:p-6">
          <CheckCircle2 className="mx-auto size-12 text-green-600" />
          <DialogTitle className="mt-3">Confirm Receipt?</DialogTitle>

          <div className="mt-4 space-y-4">
            <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
              <Image
                src={order.image}
                alt={order.title}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
              <div className="flex-1 text-left">
                <p className="font-bold">{order.title}</p>
                <p className="text-xs text-slate-500">{order.seller}</p>
              </div>
              <p className="font-bold">${order.price}</p>
            </div>

            <div className="flex gap-2 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs">
              <AlertTriangle className="size-4 text-amber-600" />
              Payment will be released to the seller.
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(null)}>
                Not received
              </Button>
              <Button
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                onClick={handleConfirm}
                disabled={loading}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CANCEL MODAL */}
      <Dialog open={open === 'cancel'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-4 text-center sm:p-6">
          <Trash2 className="mx-auto size-12 text-red-600" />
          <DialogTitle className="mt-3">Cancel Order?</DialogTitle>

          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(null)}>
              Keep Order
            </Button>
            <Button
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
