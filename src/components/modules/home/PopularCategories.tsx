'use client';

import ProductCard, { Product } from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';

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

const products: Product[] = [
  {
    id: 1,
    name: 'Men t-shirt',
    price: 24,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
  },
  {
    id: 2,
    name: 'Men t-shirt',
    price: 30,
    size: 'L',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500',
  },
  {
    id: 3,
    name: 'Woman Cloth',
    price: 40,
    size: 'S',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
  },
  {
    id: 4,
    name: 'Men t-shirt',
    price: 24,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
  },
  {
    id: 5,
    name: 'Men t-shirt, Pant',
    price: 80,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1519176373155-901e1da8460d?w=500',
  },
  {
    id: 6,
    name: 'Men t-shirt',
    price: 24,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500',
  },
  {
    id: 7,
    name: 'Woman t-shirt',
    price: 40,
    size: 'L',
    image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=500',
  },
  {
    id: 8,
    name: 'Men Shirt, Pant, Watch, Wallet',
    price: 100,
    size: 'L',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500',
  },
  {
    id: 9,
    name: 'Towel',
    price: 15,
    size: 'Long Size',
    image: 'https://images.unsplash.com/photo-1563814039166-444463d6b1d4?w=500',
  },
];

export default function PopularCategories() {
  return (
    <section className="app-container w-full py-10">
      {/* Title */}
      <h2 className="mb-6 text-xl font-semibold text-slate-800">Most popular categories</h2>

      {/* Category Pills */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item}
            className="border-brand-100 rounded-full border px-4 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100"
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
        <Button size="lg">See all items</Button>
      </div>
    </section>
  );
}
