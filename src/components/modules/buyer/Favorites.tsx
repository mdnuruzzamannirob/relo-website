'use client';

import ProductCard from '@/components/shared/ProductCard';
import { Product } from '@/types/product';

interface FavoritesProps {
  favorites: Product[];
  onToggleFavorite?: (id: string) => void;
}

export default function Favorites({ favorites, onToggleFavorite }: FavoritesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {favorites.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isLiked
          onLike={() => onToggleFavorite?.(product.id)}
        />
      ))}
    </div>
  );
}
