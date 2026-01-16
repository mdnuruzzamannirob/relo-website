'use client';

import ProductCard, { Product } from '@/components/shared/ProductCard';

const ProductGrid = () => {
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

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-slate-900">Our Collection</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
