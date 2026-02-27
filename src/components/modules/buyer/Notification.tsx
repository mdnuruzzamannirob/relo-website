import { cn } from '@/lib/utils/cn';
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';

type NotificationType =
  | 'pickup'
  | 'order_placed'
  | 'shipping'
  | 'completed'
  | 'cancelled'
  | 'reminder'
  | 'alert'
  | 'default';

const notificationConfig: Record<
  NotificationType,
  { icon: React.ElementType; iconColor: string; iconBg: string; borderColor: string }
> = {
  pickup: {
    icon: Package,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    borderColor: 'border-orange-100',
  },
  order_placed: {
    icon: ShoppingBag,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  shipping: {
    icon: Truck,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    borderColor: 'border-purple-100',
  },
  completed: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
    borderColor: 'border-green-100',
  },
  cancelled: {
    icon: XCircle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
    borderColor: 'border-red-100',
  },
  reminder: {
    icon: Clock,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50',
    borderColor: 'border-yellow-100',
  },
  alert: {
    icon: AlertCircle,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    borderColor: 'border-rose-100',
  },
  default: {
    icon: Bell,
    iconColor: 'text-gray-600',
    iconBg: 'bg-gray-50',
    borderColor: 'border-gray-100',
  },
};

function Notification({
  active = false,
  type = 'default',
  title,
  description,
  time,
}: {
  active?: boolean;
  type?: NotificationType;
  title: string;
  description: string;
  time: string;
}) {
  const config = notificationConfig[type] || notificationConfig.default;
  const Icon = config.icon;

  return (
    <div className={cn('flex gap-3 rounded-lg border p-3', active ? 'bg-brand-100' : 'bg-white')}>
      <div
        className={cn(
          'flex size-10 min-w-10 items-center justify-center rounded-lg border',
          config.iconBg,
          config.borderColor,
        )}
      >
        <Icon size={20} className={config.iconColor} />
      </div>
      <div className="flex-1">
        <p className="text-primary text-sm font-medium">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
        <p className="mt-1 text-xs text-slate-400">{time}</p>
      </div>
    </div>
  );
}

export default Notification;
