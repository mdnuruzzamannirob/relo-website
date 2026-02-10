import { redirect } from 'next/navigation';

const ProductPage = () => {
  redirect('/product?category=electronics');
};

export default ProductPage;
