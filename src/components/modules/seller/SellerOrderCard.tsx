'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/shared/StatusBadge';
import type { ColorType } from '@/components/shared/StatusBadge';
import { useOrderDepositMutation, useCancelOrderMutation } from '@/store/apis/orderApi';
import type { Order } from '@/types/order';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// ── Status badge config ──
const statusConfig: Record<string, { label: string; color: ColorType }> = {
  PENDING: { label: 'Pending', color: 'orange' },
  CONFIRM: { label: 'Confirmed', color: 'blue' },
  ACCEPT: { label: 'Accepted', color: 'green' },
  DECLINE: { label: 'Declined', color: 'red' },
  PICKUP: { label: 'Deposited', color: 'purple' },
  COMPLETE: { label: 'Completed', color: 'green' },
};

// ── Determine which actions to show ──
type SellerAction = 'deposit' | 'cancel' | 'contact';
// QR code commented out for now
// type SellerAction = 'deposit' | 'cancel' | 'contact' | 'qr';

function getSellerActions(order: Order): SellerAction[] {
  const s = order.status;

  // Complete or Decline → only contact
  if (s === 'COMPLETE' || s === 'DECLINE') return ['contact'];

  // Pickup → already deposited, only contact
  if (s === 'PICKUP') return ['contact'];

  // Confirmed payment → show deposit button + cancel + contact
  if (s === 'CONFIRM') return ['deposit', 'cancel', 'contact'];

  // Pending / Accept → cancel + contact
  return ['cancel', 'contact'];
}

const actionLabel: Record<SellerAction, string> = {
  deposit: 'Confirm Deposit',
  cancel: 'Cancel Order',
  contact: 'Contact Buyer',
  // qr: 'View QR Code',
};

export default function SellerOrderCard({ order }: { order: Order }) {
  const [openModal, setOpenModal] = useState<'deposit' | 'cancel' | null>(null);
  const [lockerNumber, setLockerNumber] = useState('');
  const [depositCode, setDepositCode] = useState('');
  const [validationError, setValidationError] = useState('');
  const router = useRouter();

  const [orderDeposit, { isLoading: isDepositing }] = useOrderDepositMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const actions = getSellerActions(order);
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
  const handleConfirmDeposit = async () => {
    setValidationError('');

    if (!lockerNumber.trim()) {
      setValidationError('Locker number is required');
      return;
    }
    if (!depositCode.trim()) {
      setValidationError('Deposit code is required');
      return;
    }
    if (depositCode.trim().length < 4) {
      setValidationError('Deposit code must be at least 4 characters');
      return;
    }

    try {
      await orderDeposit({
        orderId: order.id,
        lockerNumber: lockerNumber.trim(),
        depositCode: depositCode.trim(),
      }).unwrap();
      setOpenModal(null);
      setLockerNumber('');
      setDepositCode('');
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
              {order.buyer && (
                <p className="text-xs text-slate-500">
                  Buyer: <span className="text-primary font-medium">{order.buyer.name}</span>
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
                <p className="text-sm font-medium text-green-600">Received</p>
              </div>
            )}
          </div>

          {/* Locker info if deposited */}
          {order.status === 'PICKUP' && order.lockerNumber && (
            <div className="flex gap-2 rounded-md border border-purple-100 bg-purple-50 p-3 text-sm">
              <CheckCircle2 className="size-5 shrink-0 text-purple-600" />
              <div>
                <p className="mb-1 font-medium text-purple-600">Deposited</p>
                <p className="text-xs text-purple-500">Locker: {order.lockerNumber}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {actions.map((action) => (
              <Button
                key={action}
                variant={action === 'deposit' ? 'default' : 'outline'}
                className={
                  action === 'deposit'
                    ? 'w-full bg-green-600 text-white hover:bg-green-700'
                    : action === 'cancel'
                      ? 'w-full border-red-600 text-red-600 hover:bg-red-50'
                      : 'w-full'
                }
                onClick={() => {
                  if (action === 'contact') {
                    router.push('/seller/messages');
                  } else {
                    setOpenModal(action);
                  }
                }}
              >
                {actionLabel[action]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONFIRM DEPOSIT MODAL ── */}
      <Dialog
        open={openModal === 'deposit'}
        onOpenChange={() => {
          setOpenModal(null);
          setValidationError('');
          setLockerNumber('');
          setDepositCode('');
        }}
      >
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-4 text-center sm:p-6">
          <CheckCircle2 className="mx-auto size-12 text-green-600" />
          <DialogTitle className="mt-3">Confirm Deposit</DialogTitle>

          <div className="mt-4 space-y-4 text-left">
            <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
              <Image
                src={photo}
                alt={order.products?.title || 'Product'}
                width={40}
                height={40}
                className="size-10 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-bold">{order.products?.title}</p>
                {order.buyer && <p className="text-xs text-slate-500">{order.buyer.name}</p>}
              </div>
              <p className="font-bold">${order.amount}</p>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="lockerNumber" className="text-sm font-medium">
                  Locker Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lockerNumber"
                  placeholder="e.g. A12"
                  value={lockerNumber}
                  onChange={(e) => setLockerNumber(e.target.value)}
                  className="mt-1"
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="depositCode" className="text-sm font-medium">
                  Deposit Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="depositCode"
                  placeholder="e.g. 123456"
                  value={depositCode}
                  onChange={(e) => setDepositCode(e.target.value)}
                  className="mt-1"
                />
              </div>

              {validationError && (
                <p className="rounded-md bg-red-50 p-2 text-xs text-red-600">{validationError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setOpenModal(null);
                  setValidationError('');
                  setLockerNumber('');
                  setDepositCode('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                onClick={handleConfirmDeposit}
                disabled={isDepositing}
              >
                {isDepositing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Confirming...
                  </>
                ) : (
                  'Confirm Deposit'
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
