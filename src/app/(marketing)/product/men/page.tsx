import { redirect } from 'next/navigation';

const ProductPage = () => {
  redirect('/product?category=men');
};

export default ProductPage;
