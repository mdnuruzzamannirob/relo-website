import { cn } from '@/lib/utils/cn';

export type ColorType =
  | 'primary'
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'black'
  | 'white'
  | 'gray';
type VariantType = 'outline' | 'filled';

type StatusBadgeProps = {
  className?: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  color?: ColorType;
  variant?: VariantType;
};

const sizeConfig = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3.5 py-1.5 text-xs',
};

const colorConfig: Record<VariantType, Record<ColorType, string>> = {
  outline: {
    primary: 'bg-primary-50 border border-primary-100 text-primary-600',
    red: 'bg-red-50 border border-red-100 text-red-600',
    green: 'bg-green-50 border border-green-100 text-green-600',
    blue: 'bg-blue-50 border border-blue-100 text-blue-600',
    yellow: 'bg-yellow-50 border border-yellow-200 text-yellow-600',
    purple: 'bg-purple-50 border border-purple-100 text-purple-600',
    orange: 'bg-orange-50 border border-orange-100 text-orange-600',
    black: 'bg-gray-50 border border-gray-200 text-black',
    white: 'bg-white border border-gray-200 text-gray-900',
    gray: 'bg-gray-50 border border-gray-200 text-gray-600',
  },
  filled: {
    primary: 'bg-primary-500 text-white',
    red: 'bg-red-500 text-white',
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
    black: 'bg-black text-white',
    white: 'bg-white text-gray-900 border border-gray-200',
    gray: 'bg-gray-500 text-white',
  },
};

const StatusBadge = ({
  className,
  label,
  size = 'md',
  color = 'primary',
  variant = 'outline',
}: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        'rounded-full font-medium',
        sizeConfig[size],
        colorConfig[variant][color],
        className,
      )}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
