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
    <div className="border-brand-100 flex items-start gap-4 rounded-xl border bg-white p-4">
      {/* Image */}
      <div className="bg-brand-50 relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="">
            <h3 className="mb-1 text-sm font-semibold text-slate-800">{title}</h3>

            {size && (
              <p className="text-xs text-slate-500">
                Size: <span className="font-medium">{size}</span>
              </p>
            )}
            {postedDate && (
              <p className="text-xs text-slate-500">
                Posted date: <span className="font-medium">{postedDate}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            <p className="text-sm font-semibold text-slate-800">${price.toFixed(2)}</p>

            {status && (
              <StatusBadge
                label={status === 'published' ? 'Published' : 'Sold'}
                color={status === 'published' ? 'green' : 'purple'}
                variant="outline"
                size="sm"
              />
            )}
          </div>
        </div>

        {description && <p className="line-clamp-2 text-xs text-slate-500">{description}</p>}
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-2">
        <Link href={`/seller/my-listings/edit-listing?id=${product.id}`}>
          <Button size="icon-sm" variant="ghost" onClick={() => handleEdit(id)}>
            <Pencil className="h-4 w-4 text-slate-500" />
          </Button>
        </Link>

        <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(id)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
