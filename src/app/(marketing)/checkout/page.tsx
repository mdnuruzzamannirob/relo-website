import { Suspense } from 'react';
import CheckoutOrder from '@/components/modules/marketing/CheckoutOrder';

export const metadata = {
  title: 'Checkout',
  description: 'Checkout page',
};

const CheckoutPage = () => {
  return (
    <Suspense>
      <CheckoutOrder />
    </Suspense>
  );
};

export default CheckoutPage;
