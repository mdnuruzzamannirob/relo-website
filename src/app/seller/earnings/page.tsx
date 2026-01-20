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
import { Wallet, Clock, TrendingUp } from 'lucide-react';
import PayoutMethod from '@/components/modules/seller/PayoutMethod';
import StatusBadge from '@/components/shared/StatusBadge';

const EarningsPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="Earnings & Payouts" description="Track your income and request payouts" />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Available Balance */}
        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Wallet className="h-4 w-4 text-white/80" />
            <CardTitle className="text-sm font-normal">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$458.00</p>
            <Button className="mt-4 w-full" variant="secondary">
              Request Payout
            </Button>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <CardTitle className="text-sm font-normal">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$148.49</p>
            <p className="text-muted-foreground text-xs">Being processed</p>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <CardTitle className="text-sm font-normal">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$1,234.75</p>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Earnings */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">Ray-Ban Aviator Sunglasses</TableCell>
                  <TableCell>Mike Chen</TableCell>
                  <TableCell>2025-01-05</TableCell>
                  <TableCell>
                    <StatusBadge label="Waiting pickup" color="blue" />
                  </TableCell>
                  <TableCell className="text-right">$67.50</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout Method */}
      <PayoutMethod />

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { date: '2025-01-05', amount: '$234.50' },
                { date: '2024-12-28', amount: '$189.00' },
                { date: '2024-12-15', amount: '$320.25' },
              ].map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>Card</TableCell>
                  <TableCell>
                    <StatusBadge label="Completed" color="green" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fee Info */}
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
