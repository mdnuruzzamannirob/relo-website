'use client';

import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/constants';
import Link from 'next/dist/client/link';

const categories = [
  "Women's Bags & Wallets",
  "Women's Clothes",
  "Women's Shoes & Trainers",
  "Men's Trainers",
  "Women's Outerwear",
  "Men's Tops & T-shirts",
  "Women's Jeans",
  "Women's Handbags",
];

export default function PopularCategories() {
  return (
    <section className="app-container w-full py-10">
      {/* Title */}
      <h2 className="text-primary mb-6 text-xl font-semibold">Most popular categories</h2>

      {/* Category Pills */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item}
            className="border-brand-100 hover:bg-brand-50 rounded-full border px-4 py-1.5 text-sm text-slate-500 transition"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* See all */}
      <div className="mt-10 flex justify-center">
        <Link href="/product">
          <Button size="lg">See all items</Button>
        </Link>
      </div>
    </section>
  );
}
