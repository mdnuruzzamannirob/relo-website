'use client';

import ListingForm from '@/components/modules/seller/ListingForm';
import HeaderBar from '@/components/shared/HeaderBar';
import { useSearchParams } from 'next/navigation';
import { useGetProductDetailsQuery } from '@/store/apis/productApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { ListingValues } from '@/lib/schema';

const EditListingPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const { data, isLoading, isError, refetch } = useGetProductDetailsQuery(productId || '', {
    skip: !productId,
  });

  const product = data?.data;
  const initialData: ListingValues | undefined = product
    ? {
        title: product.title || '',
        price: product.price?.toString() || '',
        category: product.categoryId || '',
        brand: product.brandName || '',
        size: product.size ? String(product.size) : '',
        condition: product.condition || '',
        lockerSize: product.lockerSize || '',
        location: product.locationId || '',
        description: product.description || '',
        imageUrl: product.photos?.[0] || undefined,
        images: [],
      }
    : undefined;

  return (
    <section className="space-y-6">
      <HeaderBar title="Edit Listing" description="Edit your product listing details." />

      {!productId && (
        <div className="border-brand-100 bg-brand-50/50 rounded-xl border p-6 text-sm text-slate-600">
          Missing product ID. Please return to the listings page and try again.
        </div>
      )}

      {productId && isLoading && (
        <div className="border-brand-100 space-y-4 rounded-xl border bg-white p-8">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      )}

      {productId && isError && (
        <div className="border-brand-100 bg-brand-50/50 space-y-3 rounded-xl border p-6 text-sm text-slate-600">
          <p>Unable to load this listing right now.</p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {productId && !isLoading && !isError && initialData && (
        <ListingForm type="edit" initialData={initialData} productId={productId} />
      )}
    </section>
  );
};

export default EditListingPage;
