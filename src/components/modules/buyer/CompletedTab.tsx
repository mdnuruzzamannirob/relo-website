'use client';

import { TabsContent } from '@/components/ui/tabs';
import { Order } from '@/app/buyer/my-orders/page';
import OrderCard from './OrderCard';

export default function CompletedTab({ orders }: { orders: Order[] }) {
  const data = orders.filter((o) => o.status === 'completed');

  return (
    <TabsContent value="completed" className="space-y-4">
      {data.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </TabsContent>
  );
}
