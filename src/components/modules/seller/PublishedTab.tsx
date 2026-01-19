'use client';

import { TabsContent } from '@/components/ui/tabs';
import ProductRowCard, { ProductRowData } from './ProductRowCard';

export default function PublishedTab({ products }: { products?: ProductRowData[] }) {
  const publishedProducts = products?.filter((product) => product.status === 'published');
  return (
    <TabsContent value="published" className="space-y-4">
      {publishedProducts?.map((product) => (
        <ProductRowCard key={product.id} product={product} />
      ))}
    </TabsContent>
  );
}
