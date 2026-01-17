import { cn } from '@/lib/utils/cn';
import { TrendingUp } from 'lucide-react';

function ActivityItem({
  title,
  description,
  time,
  color,
}: {
  title: string;
  description: string;
  time: string;
  color: 'green' | 'blue' | 'orange';
}) {
  const colorMap = {
    green: 'bg-green-50 text-green-600 border-green-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };

  return (
    <div className={cn('flex gap-3 rounded-lg border p-3', colorMap[color])}>
      <div className="flex size-10 items-center justify-center rounded-lg bg-white">
        <TrendingUp size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs opacity-80">{description}</p>
        <p className="mt-1 text-xs opacity-60">{time}</p>
      </div>
    </div>
  );
}

export default ActivityItem;
