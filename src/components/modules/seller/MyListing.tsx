'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import ScrollableTabs from '@/components/shared/ScrollableTabs';
import TabPanel from '@/components/shared/TabPanel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ProductRowCard, { ProductRowData, ProductRowSkeleton } from './ProductRowCard';
import { useDeleteProductMutation, useGetMyProductsQuery } from '@/store/apis/productApi';

const formatDate = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const MyListing = () => {
  const [active, setActive] = React.useState<string>('all');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteModal, setDeleteModal] = React.useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useGetMyProductsQuery({
    page: 1,
    limit: 10,
  });
  const [deleteProduct] = useDeleteProductMutation();

  const products: ProductRowData[] = React.useMemo(() => {
    const apiProducts = data?.data?.result ?? [];

    return apiProducts.map((product) => ({
      id: product.id,
      title: product.title,
      size: product.size,
      price: product.price,
      image: product.photos?.[0] || '/images/banner.png',
      description: product.description,
      postedDate: formatDate(product.createdAt),
      status: product.isSold ? 'sold' : 'published',
    }));
  }, [data?.data?.result]);

  const publishedProducts = products.filter((p) => p.status === 'published');
  const soldProducts = products.filter((p) => p.status === 'sold');

  const tabs = [
    { value: 'all', label: `All Listings (${products.length})` },
    { value: 'published', label: `Published (${publishedProducts.length})` },
    { value: 'sold', label: `Sold (${soldProducts.length})` },
  ];

  const handleDelete = (id: string) => {
    setDeleteModal(id);
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;

    try {
      setDeletingId(deleteModal);
      const result = await deleteProduct(deleteModal);
      if ('error' in result) {
        return;
      }
      setDeleteModal(null);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ScrollableTabs tabs={tabs} value={active} onChange={setActive} />
        <div className="space-y-4">
          <ProductRowSkeleton />
          <ProductRowSkeleton />
          <ProductRowSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-brand-100 bg-brand-50/50 space-y-4 rounded-xl border p-6">
        <div>
          <p className="text-sm font-medium text-slate-700">Unable to load your listings.</p>
          <p className="text-sm text-slate-500">Please check your connection and retry.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="border-brand-100 space-y-4 rounded-xl border bg-white p-6 text-center">
        <div className="space-y-2">
          <p className="text-primary text-lg font-semibold">No listings yet</p>
          <p className="text-sm text-slate-500">Create your first listing to start selling.</p>
        </div>
        <Link href="/seller/my-listings/new-listing">
          <Button>Create a Listing</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ScrollableTabs tabs={tabs} value={active} onChange={setActive} />

      <TabPanel value="all" active={active} className="space-y-4">
        {products.map((product) => (
          <ProductRowCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
            isDeleting={deletingId === product.id}
          />
        ))}
      </TabPanel>

      <TabPanel value="published" active={active} className="space-y-4">
        {publishedProducts.map((product) => (
          <ProductRowCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
            isDeleting={deletingId === product.id}
          />
        ))}
      </TabPanel>

      <TabPanel value="sold" active={active} className="space-y-4">
        {soldProducts.map((product) => (
          <ProductRowCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
            isDeleting={deletingId === product.id}
          />
        ))}
      </TabPanel>

      {/* DELETE MODAL */}
      <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-4 text-center sm:p-6">
          <Trash2 className="mx-auto size-12 text-red-600" />
          <DialogTitle className="mt-3 text-lg font-semibold">Delete listing?</DialogTitle>

          <p className="mt-2 text-sm text-slate-500">
            This listing will be permanently deleted. This action cannot be undone.
          </p>

          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteModal(null)}>
              Keep Listing
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deletingId === deleteModal}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {deletingId === deleteModal ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListing;
