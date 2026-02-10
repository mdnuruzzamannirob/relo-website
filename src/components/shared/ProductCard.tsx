'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  isLiked?: boolean;
  onLike?: () => void;
  showFavorite?: boolean;
  showBuy?: boolean;
}

const ProductCard = ({
  product,
  isLiked,
  onLike,
  showFavorite = true,
  showBuy = true,
}: ProductCardProps) => {
  const imageUrl = product.photos?.[0] || '/images/banner.png';
  const sizeLabel = product.size || 'N/A';

  return (
    <div className="border-brand-100 flex h-full flex-col overflow-hidden rounded-xl border bg-white">
      <Link
        href={`/product/${product.id}`}
        className="bg-brand-50 relative block h-64 w-full overflow-hidden rounded-t-xl"
      >
        <Image
          src={imageUrl}
          alt={product.title}
          width={300}
          height={300}
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {showFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onLike?.();
            }}
            className="border-brand-50 absolute top-4 right-4 rounded-full border bg-white p-1.5"
          >
            <Heart size={18} className={isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-primary text-lg font-semibold">{product.title}</h3>
          <span className="text-primary text-lg font-semibold">${product.price}</span>
        </div>

        <p className="mb-3 text-sm text-slate-500">Size: {sizeLabel}</p>

        {showBuy && (
          <Link href={`/checkout?productId=${product.id}`} className="mt-auto">
            <Button size="lg" className="w-full">
              Buy Now
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
