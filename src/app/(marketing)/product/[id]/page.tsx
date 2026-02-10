import ProductDetails from '@/components/modules/marketing/ProductDetails';

export const metadata = {
  title: 'Product Details',
  description: 'Product Details page',
};

const ProductDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <ProductDetails productId={params.id} />
    </>
  );
};

export default ProductDetailsPage;
