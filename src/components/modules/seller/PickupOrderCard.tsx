'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Package, CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/shared/StatusBadge';
import { Order, OrderAction } from '@/app/seller/orders-and-pickup/page';

const labelMap: Record<OrderAction, string> = {
  view: 'View Locker QR Code',
  confirm: 'Confirm Deposit',
  contact: 'Contact Buyer',
};

const getOrderActions = (order: Order): OrderAction[] => {
  if (order.status === 'awaiting') return ['view', 'confirm', 'contact'];
  return ['contact'];
};

export default function PickupOrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState<OrderAction | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const actions = getOrderActions(order);

  const handleConfirm = async () => {
    setLoading(true);
    // API Call: await fetch('/api/orders/confirm', { ... })
    setLoading(false);
    setOpen(null);
  };

  const statusBadge = () => {
    switch (order.status) {
      case 'awaiting':
        return <StatusBadge label="Awaiting Deposit" color="orange" size="sm" />;
      case 'deposited':
        return <StatusBadge label="Deposited" color="green" size="sm" />;
    }
  };

  return (
    <>
      <div className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
        <Image
          src={order.image}
          alt={order.title}
          width={500}
          height={500}
          className="aspect-video w-full rounded-md object-cover sm:h-20 sm:w-20"
        />
        <div className="flex-1 space-y-4">
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

          {/* Locker info for ready orders */}
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {actions.map((action) => (
              <Button
                key={action}
                variant={action === 'contact' ? 'outline' : 'default'}
                className={cn(
                  'w-full',
                  action === 'confirm'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : action === 'view' && 'bg-brand-600 hover:bg-brand-700 text-white',
                )}
                onClick={() =>
                  action === 'contact' ? router.push('/seller/messages') : setOpen(action)
                }
              >
                {labelMap[action]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={open === 'view'} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle />
          </DialogHeader>

          {/* Receipt */}
          <div className="bg-primary space-y-4 rounded-xl p-4 text-white">
            <div className="mb-3 flex items-center justify-between text-sm">
              <div>
                <p className="mb-1 text-base font-medium">Money Receipt</p>
                <p className="text-xs text-slate-300">Show this at the locker</p>
              </div>
              <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs">Order #023645X</span>
            </div>

            <div className="bg-brand-700 flex items-center justify-between gap-3 rounded-lg p-4 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3"
                  alt=""
                  width={48}
                  height={48}
                  className="size-20 min-w-20 rounded-md object-cover"
                />
                <div className="text-sm">
                  <p className="mb-2 font-medium">Woman Bag</p>
                  <p className="text-xs text-slate-300">
                    Size: <span className="font-medium text-white">M</span>
                  </p>
                  <p className="text-xs text-slate-300">
                    Condition: <span className="font-medium text-white">Like New</span>
                  </p>
                </div>
              </div>
              <span className="text-xl font-semibold">$50.00</span>
            </div>

            {/* QR */}
            <div className="text-center">
              <Image
                src="/images/qrcode.png"
                alt="QR Code"
                width={160}
                height={160}
                className="mx-auto"
              />
              <p className="mt-2 text-xs text-slate-300">Scan this code at the locker</p>
            </div>
          </div>

          {/* Download buttons */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button variant="outline" className="border-primary text-primary h-11 gap-2">
              <Download className="size-4" />
              Download QR
            </Button>
            <Button className="h-11 gap-2">
              <Download className="size-4" />
              Download Money Receipt
            </Button>
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
              Confirm Deposit?
            </DialogTitle>
            <p className="text-center text-sm text-slate-500">
              Are you sure Deposit this Products ?
            </p>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
