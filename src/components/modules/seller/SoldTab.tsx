'use client';

import { TabsContent } from '@/components/ui/tabs';
import ProductRowCard, { ProductRowData } from './ProductRowCard';

export default function SoldTab({ products }: { products?: ProductRowData[] }) {
  const soldProducts = products?.filter((product) => product.status === 'sold');
  return (
    <TabsContent value="sold" className="space-y-4">
      {soldProducts?.map((product) => (
        <ProductRowCard key={product.id} product={product} />
      ))}
    </TabsContent>
  );
}
