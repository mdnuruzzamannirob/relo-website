'use client';

import { Search, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import Logo from '../shared/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { userNav, nav } from '@/lib/constants/nav-links';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthenticated = useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => undefined;
      const handler = () => callback();
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    },
    () =>
      (typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true') ||
      false,
    () => false,
  );

  const mode = isAuthenticated
    ? pathname.startsWith('/buyer') || pathname.startsWith('/seller')
      ? 'dashboard'
      : 'home'
    : 'guest';

  return (
    <header className="border-brand-100 sticky top-0 z-50 w-full border-b bg-white">
      <div className="app-container flex items-center justify-between gap-3 py-4">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg">
                <Menu className="size-6 text-slate-500" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader className="border-b">
                <SheetTitle className="flex items-center justify-between">
                  <Logo />
                  <SheetClose className="hover:bg-brand-50 flex size-9 min-w-9 items-center justify-center rounded-md text-slate-500">
                    <X className="size-5.5" />
                  </SheetClose>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Search Bar */}
              <div className="group relative px-4">
                <Search className="absolute top-1/2 left-6 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-600" />
                <input
                  type="text"
                  placeholder="Search for items or brands"
                  className="border-brand-100 focus:bg-brand-50/50 h-10 w-full rounded-md border px-4 pl-8 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1 p-4">
                <p className="text-xs font-medium text-slate-400 uppercase">Categories</p>
                {nav?.map((item) => (
                  <Link
                    key={item.label}
                    href="/"
                    className={`block rounded-md p-3 text-sm transition-colors ${
                      pathname === item.href
                        ? 'bg-brand-50 text-primary font-medium'
                        : 'hover:bg-brand-50 text-slate-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Logo />

        <div className="hidden flex-1 lg:block">
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
        <div className="flex items-center gap-2">
          {mode !== 'guest' ? (
            <div className="flex items-center gap-3">
              <Link href="/buyer/overview" className="hidden lg:block">
                <Button size="lg" variant={pathname.startsWith('/buyer') ? 'default' : 'secondary'}>
                  Buy
                </Button>
              </Link>
              <Link href="/seller/overview" className="hidden lg:block">
                <Button
                  size="lg"
                  variant={pathname.startsWith('/seller') ? 'default' : 'secondary'}
                >
                  Sell
                </Button>
              </Link>

              {/* Profile Popover Implementation */}
              <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                      const isActive =
                        item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                      return (
                        <Link
                          onClick={() => setIsOpen(false)}
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
                      onClick={() => {
                        localStorage.removeItem('isAuthenticated');
                        setIsOpen(false);
                        router.push('/sign-in');
                      }}
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
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" className="px-3 lg:px-6">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="px-3 lg:px-6">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {(mode === 'home' || mode === 'guest') && (
        <nav className="border-brand-50 hidden border-t bg-white lg:block">
          <ul className="app-container flex h-10 items-center gap-5 overflow-x-auto">
            {nav?.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <li key={item.label} className="relative flex h-full items-center">
                  <Link
                    href={item.href}
                    className={`group relative flex h-full items-center px-2 text-[14px] font-medium whitespace-nowrap transition-colors ${
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
