'use client';

import React from 'react';
import ScrollableTabs from '@/components/shared/ScrollableTabs';
import TabPanel from '@/components/shared/TabPanel';
import ProductRowCard, { ProductRowData } from './ProductRowCard';

const MyListing = ({ products }: { products: ProductRowData[] }) => {
  const [active, setActive] = React.useState<string>('all');

  // Filter products by status
  const publishedProducts = products.filter((p) => p.status === 'published');
  const soldProducts = products.filter((p) => p.status === 'sold');

  const tabs = [
    { value: 'all', label: `All Listings (${products.length})` },
    { value: 'published', label: `Published (${publishedProducts.length})` },
    { value: 'sold', label: `Sold (${soldProducts.length})` },
  ];

  return (
    <div className="space-y-4">
      <ScrollableTabs tabs={tabs} value={active} onChange={setActive} />

      <TabPanel value="all" active={active} className="space-y-4">
        {products.map((product) => (
          <ProductRowCard key={product.id} product={product} />
        ))}
      </TabPanel>

      <TabPanel value="published" active={active} className="space-y-4">
        {publishedProducts.map((product) => (
          <ProductRowCard key={product.id} product={product} />
        ))}
      </TabPanel>

      <TabPanel value="sold" active={active} className="space-y-4">
        {soldProducts.map((product) => (
          <ProductRowCard key={product.id} product={product} />
        ))}
      </TabPanel>
    </div>
  );
};

export default MyListing;
