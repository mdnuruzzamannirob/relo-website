'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/shared/StatusBadge';
import type { ColorType } from '@/components/shared/StatusBadge';
import { useOrderReceivedMutation, useCancelOrderMutation } from '@/store/apis/orderApi';
import type { Order } from '@/types/order';

// ── Status badge config ──
const statusConfig: Record<string, { label: string; color: ColorType }> = {
  PENDING: { label: 'Pending', color: 'orange' },
  CONFIRM: { label: 'Confirmed', color: 'blue' },
  ACCEPT: { label: 'Accepted', color: 'green' },
  DECLINE: { label: 'Declined', color: 'red' },
  PICKUP: { label: 'Ready for Pickup', color: 'purple' },
  COMPLETE: { label: 'Completed', color: 'green' },
};

// ── Determine which actions to show ──
type BuyerAction = 'cancel' | 'confirm' | 'contact';
// QR code action commented out for now
// type BuyerAction = 'cancel' | 'confirm' | 'contact' | 'qr';

function getBuyerActions(order: Order): BuyerAction[] {
  const s = order.status;

  // Completed or Declined → only contact
  if (s === 'COMPLETE' || s === 'DECLINE') return ['contact'];

  // Pickup → confirm receipt + contact
  // QR code commented out: return ['qr', 'confirm', 'contact'];
  if (s === 'PICKUP') return ['confirm', 'contact'];

  // Pending / Confirm / Accept → can cancel + contact
  return ['cancel', 'contact'];
}

const actionLabel: Record<BuyerAction, string> = {
  cancel: 'Cancel Order',
  confirm: 'Confirm Receipt',
  contact: 'Contact Seller',
  // qr: 'View QR Code',
};

export default function BuyerOrderCard({ order }: { order: Order }) {
  const [openModal, setOpenModal] = useState<'cancel' | 'confirm' | null>(null);
  const router = useRouter();

  const [orderReceived, { isLoading: isConfirming }] = useOrderReceivedMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const actions = getBuyerActions(order);
  const badge = statusConfig[order.status] ?? { label: order.status, color: 'gray' as ColorType };
  const photo = order.products?.photos?.[0] || '/images/banner.png';
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  // ── Handlers ──
  const handleConfirmReceipt = async () => {
    try {
      await orderReceived({ orderId: order.id, status: 'ACCEPT' }).unwrap();
      setOpenModal(null);
    } catch {
      // toast handled in API
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder({ orderId: order.id }).unwrap();
      setOpenModal(null);
    } catch {
      // toast handled in API
    }
  };

  return (
    <>
      {/* ── ORDER CARD ── */}
      <div className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
        <Image
          src={photo}
          alt={order.products?.title || 'Product'}
          width={500}
          height={500}
          className="aspect-video w-full rounded-md object-cover sm:h-20 sm:w-20"
        />

        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="border-brand-100 flex flex-col gap-2 border-b pb-4 sm:flex-row sm:justify-between">
            <div className="space-y-1">
              <p className="text-primary font-medium">{order.products?.title}</p>
              {order.seller && (
                <p className="text-xs text-slate-500">
                  Seller: <span className="text-primary font-medium">{order.seller.name}</span>
                </p>
              )}
              <p className="text-xs text-slate-500">
                Order ID: <span className="text-primary font-medium">{order.orderId}</span>
              </p>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
              <p className="text-primary text-lg font-semibold">${order.amount}</p>
              <StatusBadge label={badge.label} color={badge.color} size="sm" />
            </div>
          </div>

          {/* Info Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Order Date</p>
              <p className="text-primary text-sm font-medium">{formattedDate}</p>
            </div>
            {order.isPayment && (
              <div>
                <p className="text-xs text-slate-500">Payment</p>
                <p className="text-sm font-medium text-green-600">Paid</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {actions.map((action) => (
              <Button
                key={action}
                variant={action === 'confirm' ? 'default' : 'outline'}
                className={
                  action === 'confirm'
                    ? 'w-full bg-green-600 text-white hover:bg-green-700'
                    : action === 'cancel'
                      ? 'w-full border-red-600 text-red-600 hover:bg-red-50'
                      : 'w-full'
                }
                onClick={() => {
                  if (action === 'contact') {
                    router.push('/buyer/messages');
                  } else {
                    setOpenModal(action);
                  }
                  // QR code commented out for now
                  // if (action === 'qr') { ... }
                }}
              >
                {actionLabel[action]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONFIRM RECEIPT MODAL ── */}
      <Dialog open={openModal === 'confirm'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-4 text-center sm:p-6">
          <CheckCircle2 className="mx-auto size-12 text-green-600" />
          <DialogTitle className="mt-3">Confirm Receipt?</DialogTitle>

          <div className="mt-4 space-y-4">
            <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
              <Image
                src={photo}
                alt={order.products?.title || 'Product'}
                width={40}
                height={40}
                className="size-10 rounded-md object-cover"
              />
              <div className="flex-1 text-left">
                <p className="font-bold">{order.products?.title}</p>
                {order.seller && <p className="text-xs text-slate-500">{order.seller.name}</p>}
              </div>
              <p className="font-bold">${order.amount}</p>
            </div>

            <div className="flex gap-2 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs">
              <AlertTriangle className="size-4 shrink-0 text-amber-600" />
              Payment will be released to the seller.
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setOpenModal(null)}>
                Not received
              </Button>
              <Button
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                onClick={handleConfirmReceipt}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Confirming...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── CANCEL ORDER MODAL ── */}
      <Dialog open={openModal === 'cancel'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-4 text-center sm:p-6">
          <Trash2 className="mx-auto size-12 text-red-600" />
          <DialogTitle className="mt-3">Cancel Order?</DialogTitle>

          <p className="mt-2 text-sm text-slate-500">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>

          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setOpenModal(null)}>
              Keep Order
            </Button>
            <Button
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Cancelling...
                </>
              ) : (
                'Cancel Order'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
