'use client';

import { Search, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import Logo from '../shared/Logo';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const mode: string = 'dashboard'; //'guest' | 'home' | 'dashboard
  const nav = [
    { label: 'Woman', href: '/woman' },
    { label: 'Men', href: '/men' },
    { label: 'Kids', href: '/kids' },
    { label: 'Home', href: '/home' },
    { label: 'Electronics', href: '/electronics' },
    { label: 'About Us', href: '/about-us' },
  ];

  const userNav = [
    {
      label: 'Buyer Dashboard',
      href: '/buyer/overview',
      icon: LayoutDashboard,
    },
    {
      label: 'Seller Dashboard',
      href: '/seller/overview',
      icon: LayoutDashboard,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <header className="border-brand-100 sticky top-0 z-50 w-full border-b bg-white">
      {/* --- Main Header --- */}
      <div className="app-container flex items-center justify-between gap-10 py-4">
        {/* 1. Logo Section */}
        <Logo />

        {/* 2. Search Bar */}
        <div className="flex-1">
          <div className="group relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-600" />
            <input
              type="text"
              placeholder="Search for items or brands"
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 pl-12 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* 3. Right Actions */}
        {mode === 'home' || mode === 'dashboard' ? (
          <div className="flex items-center gap-3">
            <Link href="/buyer/overview">
              <Button size="lg" variant="secondary">
                Buy
              </Button>
            </Link>
            <Link href="/seller/overview">
              <Button size="lg" variant="secondary">
                Sell
              </Button>
            </Link>

            {/* Profile Popover Implementation */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-neutral-100 focus:outline-none">
                  <Avatar className="border-brand-100 h-10 w-10 border shadow-sm">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-slate-100 text-xs">JD</AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-64 rounded-xl p-0">
                {/* User Info */}
                <div className="flex items-center gap-2 border-b p-3">
                  <Avatar className="border-brand-100 size-10 min-w-10 border shadow-sm">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-slate-100 text-xs">JD</AvatarFallback>
                  </Avatar>

                  <div className="">
                    <p title="John Doe" className="text-sm font-semibold">
                      John Doe
                    </p>
                    <p title="johndoe@gmail.com" className="text-muted-foreground text-xs">
                      johndoe@gmail.com
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1 p-3">
                  {userNav.map((item) => {
                    const isActive = pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition ${
                          isActive
                            ? 'text-primary bg-brand-50 font-medium'
                            : 'hover:bg-brand-50 hover:text-primary text-slate-500'
                        }`}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    );
                  })}

                  {/* Sign out */}
                  <button
                    type="button"
                    className="text-destructive flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition hover:bg-red-50"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button size="lg" variant="ghost">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Category Bar */}
      {(mode === 'home' || mode === 'guest') && (
        <nav className="border-brand-50 border-t bg-white">
          <ul className="app-container flex h-10 items-center gap-5">
            {nav?.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.label} className="relative flex h-full items-center">
                  <Link
                    href={item.href}
                    className={`group relative flex h-full items-center px-2 text-[14px] font-medium transition-colors ${
                      isActive ? 'text-primary bg-brand-50' : 'hover:text-primary text-slate-500'
                    }`}
                  >
                    {item.label}

                    {/* underline */}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full transition-transform duration-300 ${
                        isActive
                          ? 'bg-primary scale-x-100'
                          : 'bg-primary scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
