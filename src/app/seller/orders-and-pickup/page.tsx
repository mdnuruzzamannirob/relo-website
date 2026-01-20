import PickupOrderCard from '@/components/modules/seller/PickupOrderCard';
import HeaderBar from '@/components/shared/HeaderBar';

export const metadata = {
  title: 'Orders & Pickup Locker - Seller Dashboard',
  description: 'Manage your orders and pickup locker settings as a seller.',
};

export type OrderStatus = 'awaiting' | 'deposited';
export type OrderAction = 'contact' | 'confirm' | 'view';

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
    status: 'awaiting',
    orderCode: 'ORD-1001',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
  },

  {
    id: 'ord_002',
    title: 'Woman T-Shirt',
    seller: 'Seller John',
    price: 36,
    orderDate: '2025-01-06',
    status: 'deposited',
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
    status: 'awaiting',
    orderCode: 'ORD-1003',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',

    isReviewed: false,
  },
];

const OrdersAndPickupPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="Orders & Pickup Locker" description="Manage order fulfillment" />

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <PickupOrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
};

export default OrdersAndPickupPage;
