'use client';

import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import Link from 'next/link';

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

export default function ProductRowCard({ product }: { product: ProductRowData }) {
  const { id, title, size, price, image, description, postedDate, status } = product;

  const handleEdit = (id: string) => {
    console.log(id);
  };
  const handleDelete = (id: string) => {
    console.log(id);
  };

  return (
    <div className="border-brand-100 flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
      {/* Image */}
      <Image
        src={image}
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
            <Button variant="outline" className="w-full flex-1" onClick={() => handleEdit(id)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
