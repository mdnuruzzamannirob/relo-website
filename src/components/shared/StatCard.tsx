import { cn } from '@/lib/utils/cn';

function StatCard({
  icon,
  iconClassname,
  label,
  value,
  classname,
}: {
  icon: React.ReactNode;
  iconClassname?: string;
  label: string;
  value: string;
  classname?: string;
}) {
  return (
    <div
      className={cn(
        'border-brand-100 flex items-center gap-4 rounded-xl border bg-white p-4',
        classname,
      )}
    >
      <div
        className={cn(
          'bg-brand-50 text-primary flex size-10 min-w-10 items-center justify-center rounded-lg',
          iconClassname,
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-primary text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
export default StatCard;
