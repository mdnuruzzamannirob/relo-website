import { cn } from '@/lib/utils/cn';
import { Activity } from 'lucide-react';

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
    <div className={cn('flex gap-3 rounded-lg border bg-white p-3')}>
      <div className="flex size-10 items-center justify-center rounded-lg bg-white">
        <Activity size={18} />
      </div>
      <div className="flex-1">
        <p className="text-primary text-sm font-medium">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
        <p className="mt-1 text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}

export default ActivityItem;
