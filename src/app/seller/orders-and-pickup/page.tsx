import SellerOrdersList from '@/components/modules/seller/SellerOrdersList';
import HeaderBar from '@/components/shared/HeaderBar';

export const metadata = {
  title: 'Orders & Pickup Locker - Seller Dashboard',
  description: 'Manage your orders and pickup locker settings as a seller.',
};

const OrdersAndPickupPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="Orders & Pickup Locker" description="Manage order fulfillment" />

      <SellerOrdersList />
    </section>
  );
};

export default OrdersAndPickupPage;
