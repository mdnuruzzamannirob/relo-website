import BuyerMyOrders from '@/components/modules/buyer/BuyerMyOrders';
import HeaderBar from '@/components/shared/HeaderBar';

export const metadata = {
  title: 'My Orders - Buyer Dashboard',
  description: 'Buyer My Orders page',
};

const MyOrdersPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="My Orders" description="Track and manage your purchases" />

      <BuyerMyOrders />
    </section>
  );
};

export default MyOrdersPage;
