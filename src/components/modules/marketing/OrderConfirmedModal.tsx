'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderConfirmedModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl rounded-xl p-0 sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold">Order Confirmed</DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">
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
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-11 gap-2">
              <Download className="size-4" />
              Download QR
            </Button>
            <Button variant="outline" className="border-primary h-11 gap-2">
              <Download className="size-4" />
              Download Money Receipt
            </Button>
          </div>

          {/* Next steps */}
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <p className="mb-2 font-medium text-slate-900">Next Steps:</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Seller will be notified to deposit the item</li>
              <li>You’ll receive a pickup notification</li>
              <li>Scan QR at locker to collect item</li>
              <li>Confirm receipt in your orders</li>
            </ul>
          </div>

          {/* Footer */}
          <Button className="h-11 w-full">View My Orders</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
