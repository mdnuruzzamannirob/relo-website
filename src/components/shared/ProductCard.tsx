'use client';

import { Heart, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
  const condition = product.condition || 'N/A';
  const brandName = product.brandName || 'Unknown';
  const categoryTitle = product.category?.title || '';
  const locationTitle = product.location?.title || '';
  const sellerName = product.User?.name || 'Unknown Seller';

  return (
    <div className="border-brand-100 flex h-full flex-col overflow-hidden rounded-xl border bg-white">
      <Link
        href={`/products/${product.id}`}
        className="bg-brand-50 relative block h-64 w-full overflow-hidden rounded-t-xl"
      >
        <Image
          src={imageUrl}
          alt={product.title}
          width={300}
          height={300}
          className="bg-brand-50 size-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Sold Badge */}
        {product.isSold && (
          <div className="absolute top-4 left-4">
            <Badge variant="destructive" className="bg-red-600">
              Sold
            </Badge>
          </div>
        )}

        {showFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onLike?.();
            }}
            className="border-brand-50 absolute top-4 right-4 rounded-full border bg-white p-1.5 transition-transform hover:scale-110"
          >
            <Heart size={18} className={isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-primary line-clamp-2 text-base font-semibold">{product.title}</h3>
          <span className="text-primary shrink-0 text-lg font-bold">${product.price}</span>
        </div>

        {/* Brand Name */}
        {brandName && brandName !== 'Unknown' && (
          <p className="text-xs text-slate-600">
            <span className="font-medium">{brandName}</span>
          </p>
        )}

        {/* Category */}
        {categoryTitle && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Tag size={14} className="shrink-0" />
            <span>{categoryTitle}</span>
          </div>
        )}

        {/* Location */}
        {locationTitle && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={14} className="shrink-0" />
            <span>{locationTitle}</span>
          </div>
        )}

        {/* Size and Condition */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            Size: <span className="font-medium text-slate-700">{sizeLabel}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Condition: <span className="font-medium text-slate-700">{condition}</span>
          </span>
        </div>

        {/* Seller Name */}
        <p className="text-xs text-slate-500">
          Seller: <span className="font-medium text-slate-700">{sellerName}</span>
        </p>

        {showBuy && (
          <Link href={`/checkout?productId=${product.id}`} className="mt-auto pt-2">
            <Button size="lg" className="w-full" disabled={product.isSold}>
              {product.isSold ? 'Sold Out' : 'Buy Now'}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
