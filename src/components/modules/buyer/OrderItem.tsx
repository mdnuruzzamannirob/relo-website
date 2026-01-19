import StatusBadge, { ColorType } from '@/components/shared/StatusBadge';

export type OrderItemData = {
  title: string;
  price: string;
  status: string;
  color: ColorType;
  seller: string;
  orderDate: string;
};

function OrderItem({ order }: { order: OrderItemData }) {
  const { title, price, status, color, orderDate, seller } = order;

  return (
    <div className="border-brand-100 flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="bg-brand-50 size-14 rounded-md" />
        <div>
          <p className="text-primary text-sm font-medium">{title}</p>
          <p className="text-xs text-slate-500">Seller: {seller}</p>
          <p className="text-xs text-slate-400">Order date: {orderDate}</p>
        </div>
      </div>

      <div className="space-y-2 text-right">
        <p className="text-primary font-semibold">{price}</p>
        <StatusBadge label={status} color={color} size="sm" variant="outline" />
      </div>
    </div>
  );
}
export default OrderItem;
