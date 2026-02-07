'use client';

import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export type ProductStatus = 'published' | 'sold';

export interface ProductRowData {
  id: string;
  title: string;
  size?: string;
  price: number;
  image: string;
  description?: string;
  postedDate?: string;
  status?: ProductStatus;
}

type ProductRowCardProps = {
  product: ProductRowData;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

export default function ProductRowCard({ product, onDelete, isDeleting }: ProductRowCardProps) {
  const { id, title, size, price, image, description, postedDate, status } = product;
  const previewImage = image || '/images/banner.png';

  return (
    <div className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
      {/* Image */}
      <Image
        src={previewImage}
        alt={title}
        width={500}
        height={500}
        className="aspect-video w-full rounded-md object-cover sm:h-20 sm:w-20"
      />

      {/* Info */}
      <div className="flex-1 space-y-4">
        {/* HEADER */}
        <div className="border-brand-100 flex flex-col gap-2 border-b pb-4 sm:flex-row sm:justify-between">
          <div className="space-y-1">
            <p className="text-primary font-medium">{title}</p>
            {size && (
              <p className="text-xs text-slate-500">
                Size: <span className="text-primary font-medium">{size}</span>
              </p>
            )}
            {postedDate && (
              <p className="text-xs text-slate-500">
                Posted: <span className="text-primary font-medium">{postedDate}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
            <p className="text-primary text-lg font-semibold">${price.toFixed(2)}</p>
            {status && (
              <StatusBadge
                label={status === 'published' ? 'Published' : 'Sold'}
                color={status === 'published' ? 'green' : 'purple'}
                size="sm"
              />
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        {description && (
          <div>
            <p className="line-clamp-2 text-sm text-slate-600">{description}</p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Link href={`/seller/my-listings/edit-listing?id=${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full flex-1">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete?.(id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export const ProductRowSkeleton = () => (
  <div className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
    <Skeleton className="h-32 w-full rounded-md sm:h-20 sm:w-20" />
    <div className="flex-1 space-y-4">
      <div className="border-brand-100 flex flex-col gap-2 border-b pb-4 sm:flex-row sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="mt-2 h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);
