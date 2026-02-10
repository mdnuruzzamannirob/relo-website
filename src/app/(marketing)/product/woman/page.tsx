import { redirect } from 'next/navigation';

const ProductPage = () => {
  redirect('/product?category=woman');
};

export default ProductPage;
