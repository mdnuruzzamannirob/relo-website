function OrderItem({
  title,
  price,
  status,
  statusClass,
}: {
  title: string;
  price: string;
  status: string;
  statusClass: string;
}) {
  return (
    <div className="border-brand-100 flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="bg-brand-50 size-14 rounded-md" />
        <div>
          <p className="text-primary text-sm font-medium">{title}</p>
          <p className="text-xs text-slate-500">Seller: Sarah Johnson</p>
          <p className="text-xs text-slate-400">Order date: 2025-01-05</p>
        </div>
      </div>

      <div className="space-y-2 text-right">
        <p className="text-primary font-semibold">{price}</p>
        <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass}`}>{status}</span>
      </div>
    </div>
  );
}
export default OrderItem;
