export type NavigationLink = {
  label: string;
  href: string;
  icon: LucideIcon;
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
