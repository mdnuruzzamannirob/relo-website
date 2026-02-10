'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, MessageSquare, X } from 'lucide-react';
import ProductGallery from '@/components/shared/ProductGallery';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetMyFavoriteProductsQuery,
  useGetProductDetailsQuery,
  useToggleFavoriteMutation,
} from '@/store/apis/productApi';
import { useAuth } from '@/hooks/useAuth';

export default function ProductDetails() {
  const [showOffer, setShowOffer] = useState(false);

  const router = useRouter();
  const params = useParams();
  const productId = typeof params?.id === 'string' ? params.id : '';

  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError, refetch } = useGetProductDetailsQuery(productId, {
    skip: !productId,
  });

  const { data: favoritesData } = useGetMyFavoriteProductsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleFavorite, { isLoading: isToggling }] = useToggleFavoriteMutation();

  const product = data?.data;
  const images = product?.photos?.length ? product.photos : ['/images/banner.png'];
  const favoriteIds = useMemo(
    () => new Set(favoritesData?.data?.map((item) => item.product.id) || []),
    [favoritesData],
  );
  const metaItems = [
    product?.size ? { label: 'Size', value: product.size } : null,
    product?.condition ? { label: 'Condition', value: product.condition } : null,
    product?.brandName ? { label: 'Brand', value: product.brandName } : null,
    product?.locationId ? { label: 'Location', value: product.locationId } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      {/* Back */}
      <Link href="/" className="mb-6 block w-fit">
        <Button>
          <ArrowLeft className="mr-1 size-4" />
          Back
        </Button>
      </Link>

      {!productId && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          No product selected.
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="border-brand-100 h-fit space-y-4 rounded-xl border p-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-3/4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          <p>Failed to load product details.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && product && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT: Images */}
          <ProductGallery title={product.title} images={images} />

          {/* RIGHT: Details */}
          <div className="border-brand-100 h-fit rounded-xl border p-6">
            {/* Price & Wishlist */}
            <div className="mb-4 flex items-start justify-between">
              <span className="text-primary text-xl font-semibold">${product.price}</span>
              <button
                className="hover:text-primary text-slate-400 transition"
                onClick={() => {
                  if (!isToggling) {
                    toggleFavorite(product.id);
                  }
                }}
              >
                <Heart
                  className={`h-5 w-5 ${
                    favoriteIds.has(product.id) || product.isFavorite
                      ? 'fill-red-500 text-red-500'
                      : ''
                  }`}
                />
              </button>
            </div>

            <h1 className="text-primary mb-4 text-xl font-semibold">{product.title}</h1>

            {/* Meta */}
            <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
              {metaItems.length === 0 && (
                <p className="text-slate-500">No additional details shared.</p>
              )}
              {metaItems.map((item) => (
                <p key={item.label}>
                  <span className="text-slate-500">{item.label}:</span> {item.value}
                </p>
              ))}
            </div>

            {/* Actions */}
            <div className="mb-6 space-y-4">
              <Button
                onClick={() => router.push(`/checkout?productId=${product.id}`)}
                className="h-11 w-full"
              >
                Buy Now
              </Button>

              {!showOffer ? (
                <Button
                  variant="outline"
                  className="h-11 w-full"
                  onClick={() => setShowOffer(true)}
                >
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
              <p className="text-sm leading-relaxed text-slate-500">
                {product.description || 'No description provided.'}
              </p>
            </div>

            {/* Seller */}
            <div className="border-brand-100 rounded-lg border p-4">
              <h2 className="text-primary mb-3 font-semibold">Seller information</h2>
              <div className="mb-4 flex items-center gap-3">
                <Image
                  src="https://randomuser.me/api/portraits/lego/2.jpg"
                  alt="Seller"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-primary text-sm font-medium">Seller</p>
                  <p className="text-xs text-slate-500">Seller details coming soon</p>
                </div>
              </div>

              <Link href="/chat" passHref>
                <Button className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
