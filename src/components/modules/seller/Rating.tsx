'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    productName: 'Woman Bag',
    buyerName: 'Sarah Johnson',
    rating: 5,
    date: '2025-01-08',
    comment: 'Exactly as described! Great seller.',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300',
  },
  {
    id: 2,
    productName: 'Woman T-shirt',
    buyerName: 'Emily Carter',
    rating: 4,
    date: '2025-01-02',
    comment: 'Good quality, fast delivery.',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300',
  },
];

// ------------------
// Page / Component
// ------------------
export default function Rating() {
  return (
    <div className="space-y-4 lg:space-y-5">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-brand-100 group flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md md:flex-row md:gap-5 md:p-5"
        >
          {/* Image */}
          <Image
            src={review.image}
            alt={review.productName}
            width={500}
            height={500}
            className="aspect-video w-full rounded-lg object-cover shadow-sm transition-transform group-hover:scale-[1.02] sm:aspect-square sm:h-32 sm:w-32 md:h-28 md:w-28 lg:h-32 lg:w-32"
          />

          {/* Content */}
          <div className="flex-1 space-y-2.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-800 sm:text-lg md:text-xl">
                  {review.productName}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Buyer: <span className="font-semibold text-slate-700">{review.buyerName}</span>
                </p>
              </div>

              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {review.date}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 transition-all sm:h-5 sm:w-5 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700">{review.rating}.0</span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3.5 md:p-4">
              <p className="text-sm leading-relaxed text-slate-700 md:text-base">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
