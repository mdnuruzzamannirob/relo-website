import { redirect } from 'next/navigation';

const ProductPage = () => {
  redirect('/product?category=kids');
};

export default ProductPage;
