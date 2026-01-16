import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex shrink-0 flex-col -space-y-1.5">
      <span className="text-primary text-3xl font-bold tracking-tighter">CAYRE</span>
      <span className="text-[10px] font-medium text-slate-500 uppercase">Cayman Resellers</span>
    </Link>
  );
};

export default Logo;
