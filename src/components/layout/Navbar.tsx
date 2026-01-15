'use client';

import { Search, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';

export default function Navbar() {
  const mode: string = 'guest'; //'guest' | 'home' | 'dashboard

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* --- Main Header --- */}
      <div className="container mx-auto flex items-center justify-between gap-10 px-6 py-4">
        {/* 1. Logo Section */}
        <Link href="/" className="flex shrink-0 flex-col -space-y-1.5">
          <span className="text-primary text-[28px] font-bold tracking-tighter">CAYRE</span>
          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            Cayman Resellers
          </span>
        </Link>

        {/* 2. Search Bar */}
        <div className="flex-1">
          <div className="group relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-600" />
            <input
              type="text"
              placeholder="Search for items or brands"
              className="h-11 w-full rounded-xl border border-slate-200 bg-[#f9fafb] pr-4 pl-12 text-sm transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* 3. Right Actions */}
        {mode === 'home' || mode === 'dashboard' ? (
          <div className="flex items-center gap-3">
            <Button size="lg" variant="secondary">
              Buy
            </Button>
            <Button size="lg" variant="secondary">
              Sell
            </Button>

            {/* Profile Popover Implementation */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-neutral-100 focus:outline-none">
                  <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-slate-100 text-xs">JD</AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-64 rounded-xl p-0">
                {/* User Info */}
                <div className="flex items-center gap-2 border-b p-3">
                  <Avatar className="size-10 min-w-10 border border-slate-100 shadow-sm">
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
                  {[
                    { label: 'Buyer Dashboard', icon: LayoutDashboard },
                    { label: 'Seller Dashboard', icon: LayoutDashboard },
                    { label: 'Settings', icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="hover:bg-brand-50 flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-slate-500 transition hover:text-slate-800"
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </button>
                  ))}
                  <button className="text-destructive flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition hover:bg-red-50">
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button size="lg" variant="ghost">
              Login
            </Button>
            <Button size="lg">Sign up</Button>
          </div>
        )}
      </div>

      {/* --- Category Bar (Polished) --- */}
      {mode === 'home' && (
        <nav className="border-t border-slate-100 bg-white">
          <ul className="container mx-auto flex h-12 items-center gap-10 px-6">
            {['Woman', 'Men', 'Kids', 'Home', 'Electronics', 'About Us'].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="group relative text-[14px] font-medium text-slate-500 transition-colors hover:text-black"
                >
                  {item}
                  <span className="absolute -bottom-3.75 left-0 h-0.5 w-0 bg-[#0f3443] transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
