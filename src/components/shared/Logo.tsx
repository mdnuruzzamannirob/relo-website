import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn('flex w-fit shrink-0 flex-col -space-y-1.5', className)}>
      <span className="text-primary text-3xl font-bold tracking-tighter">CAYRE</span>
      <span className="text-[10px] font-medium text-slate-500 uppercase">Cayman Resellers</span>
    </Link>
  );
};

export default Logo;
