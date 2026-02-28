'use client';

import { useState } from 'react';
import HeaderBar from '@/components/shared/HeaderBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Wallet, Clock, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import PayoutMethod from '@/components/modules/seller/PayoutMethod';
import StatusBadge from '@/components/shared/StatusBadge';
import ButtonComp from '@/components/shared/ButtonComp';
import { EarningsPageSkeleton } from '@/components/shared/SkeletonLoaders';
import {
  useGetMyEarningsQuery,
  useRequestPayoutMutation,
  useGetPayoutHistoryQuery,
} from '@/store/apis/earningsApi';

const fmt = (amount: number, currency = 'usd') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(
    amount,
  );

const fmtDate = (dateStr: string | null) =>
  dateStr ? new Date(dateStr).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—';

const payoutStatusColor = (status: string): 'green' | 'orange' | 'red' => {
  if (status === 'PAID') return 'green';
  if (status === 'PENDING') return 'orange';
  return 'red';
};

const HISTORY_LIMIT = 10;

const EarningsPage = () => {
  const [historyPage, setHistoryPage] = useState(1);

  const {
    data: earningsData,
    isLoading: earningsLoading,
    isError: earningsError,
    refetch: refetchEarnings,
  } = useGetMyEarningsQuery();

  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
  } = useGetPayoutHistoryQuery({ page: historyPage, limit: HISTORY_LIMIT });

  const [requestPayout, { isLoading: payoutLoading }] = useRequestPayoutMutation();

  // ── Full page skeleton while main earnings data loads ──────────────────────
  if (earningsLoading) return <EarningsPageSkeleton />;

  // ── Full page error ────────────────────────────────────────────────────────
  if (earningsError) {
    return (
      <section className="space-y-6">
        <HeaderBar title="Earnings & Payouts" description="Track your income and request payouts" />
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-sm font-medium text-red-700">
              Failed to load earnings. Please try again.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetchEarnings()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const earnings = earningsData?.data;
  const historyItems = historyData?.data?.result ?? [];
  const historyMeta = historyData?.data?.meta;
  const totalPages = historyMeta?.totalPage ?? 1;

  return (
    <section className="space-y-6">
      <HeaderBar title="Earnings & Payouts" description="Track your income and request payouts" />

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Available Balance */}
        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Wallet className="h-4 w-4 text-white/80" />
            <CardTitle className="text-sm font-normal">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmt(earnings?.availableWithdrawal ?? 0)}</p>
            <ButtonComp
              className="mt-4 w-full bg-green-600 hover:bg-green-700"
              loading={payoutLoading}
              disabled={payoutLoading || (earnings?.availableWithdrawal ?? 0) <= 0}
              loadingText="Requesting..."
              onClick={() => requestPayout()}
            >
              Request Payout
            </ButtonComp>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <CardTitle className="text-sm font-normal">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmt(earnings?.pendingPayment ?? 0)}</p>
            <p className="text-muted-foreground text-xs">Being processed</p>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <CardTitle className="text-sm font-normal">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmt(earnings?.totalPayment ?? 0)}</p>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Pending Earnings ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          {!earnings?.pendingEarnings?.length ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No pending earnings at the moment.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Released At</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.pendingEarnings.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{fmtDate(item.createdAt)}</TableCell>
                    <TableCell>
                      {item.releasedAt ? (
                        fmtDate(item.releasedAt)
                      ) : (
                        <StatusBadge label="Pending" color="orange" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">{fmt(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── Payout Method ────────────────────────────────────────────────── */}
      <PayoutMethod />

      {/* ── Payout History ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          {historyError ? (
            <p className="py-6 text-center text-sm text-red-500">Failed to load payout history.</p>
          ) : historyLoading ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted h-10 animate-pulse rounded-md" />
              ))}
            </div>
          ) : !historyItems.length ? (
            <p className="text-muted-foreground py-8 text-center text-sm">No payout history yet.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Arrival Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyItems.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{fmtDate(row.createdAt)}</TableCell>
                      <TableCell>{fmtDate(row.arrivalDate)}</TableCell>
                      <TableCell>{fmt(row.amount, row.currency)}</TableCell>
                      <TableCell className="capitalize">{row.method}</TableCell>
                      <TableCell>
                        <StatusBadge label={row.status} color={payoutStatusColor(row.status)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={historyPage <= 1}
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-muted-foreground text-sm">
                    Page {historyPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={historyPage >= totalPages}
                    onClick={() => setHistoryPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Fee Information ──────────────────────────────────────────────── */}
      <Card className="bg-brand-100 border-brand-200">
        <CardHeader>
          <CardTitle>Fee Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          Marketplace charges a 15% commission on all completed sales. This covers payment
          processing, locker usage, and platform maintenance. Payouts are processed within 24 hours
          after buyer confirms pickup.
        </CardContent>
      </Card>
    </section>
  );
};

export default EarningsPage;
