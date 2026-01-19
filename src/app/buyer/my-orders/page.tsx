import AllOrdersTab from '@/components/modules/buyer/AllOrdersTab';
import CompletedTab from '@/components/modules/buyer/CompletedTab';
import ProcessingTab from '@/components/modules/buyer/ProcessingTab';
import ReadyForPickupTab from '@/components/modules/buyer/ReadyForPickupTab';
import HeaderBar from '@/components/shared/HeaderBar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'My Orders - Buyer Dashboard',
  description: 'Buyer My Orders page',
};

export type OrderStatus = 'processing' | 'ready' | 'completed';
export type OrderAction = 'contact' | 'cancel' | 'qr' | 'confirm' | 'review';

export interface Order {
  id: string;
  title: string;
  seller: string;
  price: number;
  orderDate: string;
  completedDate?: string;
  status: OrderStatus;

  image: string; // product image
  orderCode: string;

  // only for ready
  locker?: {
    name: string;
    address: string;
  };

  // only for completed
  isReviewed?: boolean;
}

export const orders: Order[] = [
  {
    id: 'ord_001',
    title: 'Men T-Shirt',
    seller: 'Seller Johnson',
    price: 30,
    orderDate: '2025-01-06',
    status: 'processing',
    orderCode: 'ORD-1001',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
  },

  {
    id: 'ord_002',
    title: 'Woman T-Shirt',
    seller: 'Seller John',
    price: 36,
    orderDate: '2025-01-06',
    status: 'ready',
    orderCode: 'ORD-1002',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',

    locker: {
      name: 'Locker A12',
      address: '123 Main Street, New York, NY 10001',
    },
  },

  {
    id: 'ord_003',
    title: 'Woman Bag',
    seller: 'Seller Anderson',
    price: 89.99,
    orderDate: '2025-01-07',
    completedDate: '2025-01-07',
    status: 'completed',
    orderCode: 'ORD-1003',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',

    isReviewed: false,
  },
];

const MyOrdersPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="My Orders" description="Track and manage your purchases" />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          {[
            { value: 'all', label: 'All Orders (3)' },
            { value: 'processing', label: 'Processing (1)' },
            { value: 'ready', label: 'Ready for Pickup (1)' },
            { value: 'completed', label: 'Completed (1)' },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AllOrdersTab orders={orders} />
        <ProcessingTab orders={orders} />
        <ReadyForPickupTab orders={orders} />
        <CompletedTab orders={orders} />
      </Tabs>
    </section>
  );
};

export default MyOrdersPage;
