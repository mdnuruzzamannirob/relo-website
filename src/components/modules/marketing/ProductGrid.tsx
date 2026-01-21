'use client';

import ProductCard from '@/components/shared/ProductCard';
import { products } from '@/lib/constants';

const ProductGrid = () => {
  return (
    <section className="bg-brand-50 min-h-screen py-10">
      <div className="app-container">
        <h1 className="text-primary mb-8 text-center text-3xl font-semibold">Our Collection</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
