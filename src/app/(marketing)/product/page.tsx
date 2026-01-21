import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/constants';

const ProductPage = () => {
  return (
    <section className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      <h1 className="text-primary mb-8 text-center text-2xl font-semibold">Our Collection</h1>

      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 9).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* See all */}
      <div className="mt-10 flex justify-center">
        <Button size="lg">See more</Button>
      </div>
    </section>
  );
};

export default ProductPage;
