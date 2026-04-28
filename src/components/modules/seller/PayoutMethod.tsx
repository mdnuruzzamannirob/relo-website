'use client';

import ButtonComp from '@/components/shared/ButtonComp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useConnectPaypalAccountMutation } from '@/store/apis/authApi';
import { CreditCard } from 'lucide-react';
import { useState } from 'react';

const PayoutMethod = () => {
  const { user } = useAuth();
  const [connectPaypalAccount, { isLoading: isConnecting }] = useConnectPaypalAccountMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnectClick = () => {
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!paypalEmail.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await connectPaypalAccount({ paypalEmail });
      setPaypalEmail('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error connecting PayPal account:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaypalEmail(e.target.value);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Payout Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted flex items-center justify-between rounded-md border p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium">Paypal Connect</span>
            </div>

            {user?.isPaypalAccountActive ? (
              <Button className="cursor-default bg-green-600 text-white hover:bg-green-600">
                Connected
              </Button>
            ) : (
              <ButtonComp
                loading={isConnecting}
                disabled={isConnecting}
                loadingText="Connecting..."
                onClick={handleConnectClick}
              >
                Connect
              </ButtonComp>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect PayPal Account</DialogTitle>
            <DialogDescription>
              Enter your PayPal email address to connect your account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paypal-email">PayPal Email</Label>
              <Input
                id="paypal-email"
                type="email"
                placeholder="your-email@example.com"
                value={paypalEmail}
                onChange={handleEmailChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <ButtonComp
                loading={isSubmitting}
                disabled={isSubmitting || !paypalEmail.trim()}
                loadingText="Connecting..."
                onClick={handleSubmit}
              >
                Connect
              </ButtonComp>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayoutMethod;
