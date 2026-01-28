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
    <div className="space-y-3 sm:space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-brand-100 flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:gap-4 sm:p-4"
        >
          <div className="bg-brand-50 relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:size-20 sm:min-w-20">
            <Image src={review.image} alt={review.product} fill className="object-cover" />
          </div>

          <div className="flex-1 space-y-1.5 sm:space-y-1">
            <h3 className="text-sm font-semibold text-slate-800 sm:text-base">{review.product}</h3>

            <p className="text-xs text-slate-500 sm:text-sm">Buyer: {review.seller}</p>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 sm:h-5 sm:w-5" />
              ))}
              <span className="ml-2 text-xs text-slate-400 sm:text-sm">{review.date}</span>
            </div>

            <p className="pt-1 text-sm text-slate-700 sm:text-base">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
