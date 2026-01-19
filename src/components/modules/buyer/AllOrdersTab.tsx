'use client';

import { TabsContent } from '@/components/ui/tabs';
import { Order } from '@/app/buyer/my-orders/page';
import OrderCard from './OrderCard';

export default function AllOrdersTab({ orders }: { orders: Order[] }) {
  return (
    <TabsContent value="all" className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </TabsContent>
  );
}
