'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Order, OrderAction } from '@/app/buyer/my-orders/page';
import { MapPin, Package } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();
  const actions = getOrderActions(order);

  const statusBadge = () => {
    switch (order.status) {
      case 'processing':
        return (
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs text-blue-600">
            Processing
          </span>
        );
      case 'ready':
        return (
          <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs text-orange-600">
            Ready for Pickup
          </span>
        );
      case 'completed':
        return (
          <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs text-green-600">
            Completed
          </span>
        );
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
          <div className="flex flex-1 justify-between border-b pb-4">
            <div className="space-y-1">
              <p className="text-brand-900 font-medium">{order.title}</p>
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

          {/* Action buttons */}
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
                  'h-10 flex-1',
                  action === 'confirm'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : action === 'review'
                      ? 'bg-brand-600 hover:bg-brand-700 text-white'
                      : action === 'cancel'
                        ? 'border-red-600 text-red-600 hover:bg-red-50'
                        : '',
                )}
                onClick={() => {
                  if (action === 'contact') {
                    router.push('/buyer/messages');
                  } else {
                    setOpen(action);
                  }
                }}
              >
                {labelMap[action]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={open === 'cancel'} onOpenChange={() => setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order?</DialogTitle>
          </DialogHeader>
          <Button className="mt-2 w-full bg-red-600 text-white">Confirm Cancel</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={open === 'confirm'} onOpenChange={() => setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Pickup</DialogTitle>
          </DialogHeader>
          <Button className="mt-2 w-full bg-green-600 text-white">Confirm</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={open === 'review'} onOpenChange={() => setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write Review</DialogTitle>
          </DialogHeader>
          <textarea
            placeholder="Your review..."
            className="mt-2 w-full rounded border border-slate-200 p-2"
          />
          <Button className="bg-brand-600 mt-2 w-full text-white">Submit</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
