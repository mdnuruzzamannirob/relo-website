'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

export interface Product {
  id: number;
  name: string;
  price: number;
  size: string;
  image: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="relative h-64 w-full overflow-hidden rounded-t-xl bg-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <button className="absolute top-4 right-4 rounded-full bg-white/80 p-1.5 text-slate-400 transition-colors hover:text-red-500">
          <Heart size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
          <span className="text-primary text-lg font-semibold">${product.price}</span>
        </div>
        <p className="mb-3 text-sm text-slate-500">Size: {product.size}</p>

        <Button size={'lg'} className="mt-auto shrink">
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
