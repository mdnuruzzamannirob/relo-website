'use client';

import { TabsContent } from '@/components/ui/tabs';
import ProductRowCard, { ProductRowData } from './ProductRowCard';

export default function AllListingsTab({ products }: { products?: ProductRowData[] }) {
  return (
    <TabsContent value="all" className="space-y-4">
      {products?.map((product) => (
        <ProductRowCard key={product.id} product={product} />
      ))}
    </TabsContent>
  );
}
