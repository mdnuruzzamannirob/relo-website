'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, MessageSquare, X } from 'lucide-react';
import ProductGallery from '@/components/shared/ProductGallery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const product = {
  title: 'Woman Bag',
  price: 40,
  images: [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
  ],
  meta: [
    { label: 'Size', value: 'M' },
    { label: 'Condition', value: 'Like New' },
    { label: 'Brand', value: 'Gucci' },
    { label: 'Location', value: 'New York, NY' },
  ],
  description:
    'Stylish and versatile women’s bag in excellent condition, perfect for everyday use or special occasions. Designed with spacious compartments to keep your essentials organized while adding a classy touch to any outfit. Stylish and versatile women’s bag in excellent condition, perfect for everyday use or special occasions. Designed with spacious compartments to keep your essentials organized while adding a classy touch to any outfit.',
  seller: {
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.8,
    reviews: 127,
  },
};

export default function ProductDetails() {
  const [showOffer, setShowOffer] = useState(false);

  const router = useRouter();

  return (
    <div className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      {/* Back */}
      <Link href="/" className="mb-6 block w-fit">
        <Button>
          <ArrowLeft className="mr-1 size-4" />
          Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* LEFT: Images */}
        <ProductGallery title={product.title} images={product.images} />

        {/* RIGHT: Details */}
        <div className="border-brand-100 h-fit rounded-xl border p-6">
          {/* Price & Wishlist */}
          <div className="mb-4 flex items-start justify-between">
            <span className="text-primary text-xl font-semibold">${product.price}</span>
            <button className="hover:text-primary text-slate-400 transition">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <h1 className="text-primary mb-4 text-xl font-semibold">{product.title}</h1>

          {/* Meta */}
          <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
            {product.meta.map((item) => (
              <p key={item.label}>
                <span className="text-slate-500">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div className="mb-6 space-y-4">
            <Button onClick={() => router.push('/checkout')} className="h-11 w-full">
              Buy Now
            </Button>

            {!showOffer ? (
              <Button variant="outline" className="h-11 w-full" onClick={() => setShowOffer(true)}>
                Make an offer
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Your offer"
                  className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                />
                <Button className="h-11 px-5">Send</Button>

                <button
                  onClick={() => setShowOffer(false)}
                  className="hover:text-primary rounded-md p-2 text-slate-400 transition"
                  aria-label="Cancel offer"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-primary mb-2 font-semibold">Description</h2>
            <p className="text-sm leading-relaxed text-slate-500">{product.description}</p>
          </div>

          {/* Seller */}
          <div className="border-brand-100 rounded-lg border p-4">
            <h2 className="text-primary mb-3 font-semibold">Seller information</h2>

            <div className="mb-4 flex items-center gap-3">
              <Image
                src={product.seller.avatar}
                alt={product.seller.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="text-primary text-sm font-medium">{product.seller.name}</p>
                <p className="text-xs text-slate-500">
                  ⭐ {product.seller.rating} · {product.seller.reviews} reviews
                </p>
              </div>
            </div>

            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
