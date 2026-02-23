import { Suspense } from 'react';
import CheckoutFrom from '@/components/modules/marketing/CheckoutFrom';

export const metadata = {
  title: 'Checkout',
  description: 'Checkout page',
};

const CheckoutPage = () => {
  return (
    <Suspense>
      <CheckoutFrom />
    </Suspense>
  );
};

export default CheckoutPage;
