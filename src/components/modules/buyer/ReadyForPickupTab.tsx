'use client';

import { Order } from '@/app/buyer/my-orders/page';
import { TabsContent } from '@/components/ui/tabs';
import OrderCard from './OrderCard';

export default function ReadyForPickupTab({ orders }: { orders: Order[] }) {
  const data = orders.filter((o) => o.status === 'ready');

  return (
    <TabsContent value="ready" className="space-y-4">
      {data.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </TabsContent>
  );
}
