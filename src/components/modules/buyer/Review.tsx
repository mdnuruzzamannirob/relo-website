'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';

const reviews = [
  {
    id: 1,
    product: 'Woman Bag',
    seller: 'Sarah Johnson',
    rating: 5,
    date: '2025-01-08',
    comment: 'Exactly as described! Great seller.',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
  },
];

export default function Reviews() {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-brand-100 rounded-lg border bg-white p-4">
          <div className="flex items-center gap-4">
            <Image
              src={review.image}
              alt={review.product}
              width={80}
              height={80}
              className="size-20 min-w-20 rounded-md object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{review.product}</p>
              <p className="text-xs text-slate-500">Seller: {review.seller}</p>

              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-xs text-slate-400">{review.date}</span>
              </div>
            </div>{' '}
          </div>{' '}
          <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
