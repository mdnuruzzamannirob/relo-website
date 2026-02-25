'use client';

import ButtonComp from '@/components/shared/ButtonComp';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useConnectStripeAccountMutation } from '@/store/apis/authApi';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const PayoutMethod = () => {
  const { user } = useAuth();
  const [connectStripeAccount, { isLoading: isConnecting }] = useConnectStripeAccountMutation();

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

          {user?.isStripeAccountActive ? (
            <Button className="cursor-default bg-green-600 text-white hover:bg-green-600">
              Connected
            </Button>
          ) : (
            <ButtonComp
              loading={isConnecting}
              disabled={isConnecting}
              loadingText="Connecting..."
              onClick={() => connectStripeAccount()}
            >
              Connect
            </ButtonComp>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayoutMethod;
