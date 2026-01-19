'use client';

import { useState } from 'react';
import ProductCard, { Product } from '@/components/shared/ProductCard';

interface FavoritesProps {
  favorites: Product[];
}

export default function Favorites({ favorites }: FavoritesProps) {
  const [liked, setLiked] = useState<number[]>(favorites.map((item) => item.id));

  const toggleLike = (id: number) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {favorites.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isLiked={liked.includes(product.id)}
          onLike={() => toggleLike(product.id)}
        />
      ))}
    </div>
  );
}
