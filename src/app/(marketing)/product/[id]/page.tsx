import ProductDetails from '@/components/modules/marketing/ProductDetails';
import { Suspense } from 'react';

export const metadata = {
  title: 'Product Details',
  description: 'Product Details page',
};

const ProductDetailsPage = () => {
  return (
    <Suspense>
      <ProductDetails />
    </Suspense>
  );
};

export default ProductDetailsPage;
