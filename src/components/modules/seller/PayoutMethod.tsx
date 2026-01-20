'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const PayoutMethod = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Payout Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted flex items-center justify-between rounded-md border p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-slate-600" />
            <span className="text-sm font-medium">Stripe Connect</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm">Connect</Button>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <Button variant="outline" className="w-full">
          Add Payment Method
        </Button>
      </CardContent>
    </Card>
  );
};

export default PayoutMethod;
