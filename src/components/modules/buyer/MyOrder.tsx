'use client';

import React from 'react';
import ScrollableTabs from '@/components/shared/ScrollableTabs';
import TabPanel from '@/components/shared/TabPanel';
import OrderCard from './OrderCard';
import { Order } from '@/types';

const MyOrder = ({ orders }: { orders: Order[] }) => {
  const [active, setActive] = React.useState<string>('all');

  // Filter orders by status
  const processingOrders = orders.filter((o) => o.status === 'processing');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const tabs = [
    { value: 'all', label: `All Orders (${orders.length})` },
    { value: 'processing', label: `Processing (${processingOrders.length})` },
    { value: 'ready', label: `Ready for Pickup (${readyOrders.length})` },
    { value: 'completed', label: `Completed (${completedOrders.length})` },
  ];

  return (
    <div className="space-y-4">
      <ScrollableTabs tabs={tabs} value={active} onChange={setActive} />

      <TabPanel value="all" active={active} className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </TabPanel>

      <TabPanel value="processing" active={active} className="space-y-4">
        {processingOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </TabPanel>

      <TabPanel value="ready" active={active} className="space-y-4">
        {readyOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </TabPanel>

      <TabPanel value="completed" active={active} className="space-y-4">
        {completedOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </TabPanel>
    </div>
  );
};

export default MyOrder;
