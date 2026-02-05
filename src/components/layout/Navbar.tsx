'use client';

import { Search, LogOut, Menu, X, Loader2 } from 'lucide-react';
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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userNav, nav } from '@/lib/constants/nav-links';
import { useLogoutMutation } from '@/store/apis/authApi';
import { useAppSelector } from '@/store/hook';

/* Utils */
const getInitials = (fullName?: string): string => {
  if (!fullName) return 'U';

  return fullName
    .trim()
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

/* Avatar Skeleton */
function AvatarSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-20 animate-pulse rounded-md bg-slate-200" />
      <div className="h-10 w-20 animate-pulse rounded-md bg-slate-200" />
      <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category');

  const [isOpen, setIsOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.user);
  const [logout, { isLoading: isLogoutLoading, isSuccess }] = useLogoutMutation();

  const showAuthSkeleton = !hasHydrated || isLoading;

  /* Redirect after logout */
  useEffect(() => {
    if (isSuccess) {
      router.push('/');
    }
  }, [isSuccess, router]);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  /* Render */
  return (
    <header className="border-brand-100 sticky top-0 z-50 w-full border-b bg-white">
      {/* Top Bar */}
      <div className="app-container flex items-center justify-between gap-3 py-4">
        {/* Mobile Menu */}
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

              {/* Mobile Search */}
              <div className="group relative px-4">
                <Search className="absolute top-1/2 left-6 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search..."
                  className="border-brand-100 focus:bg-brand-50/50 h-10 w-full rounded-md border px-4 pl-8 text-sm outline-none"
                />
              </div>

              {/* Mobile Nav */}
              <nav className="flex flex-col gap-1 px-4">
                {nav.map((item) => {
                  const isActive = category
                    ? item.href.includes(`category=${category}`)
                    : pathname === item.href;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`rounded-md p-3 text-sm transition ${
                        isActive
                          ? 'bg-brand-50 text-primary font-medium'
                          : 'hover:bg-brand-50 text-slate-600'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Logo />

        {/* Desktop Search */}
        <div className="hidden flex-1 lg:block">
          <div className="group relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search..."
              className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 pl-12 text-sm outline-none"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Loading Skeleton */}
          {showAuthSkeleton && (
            <div className="flex items-center gap-3">
              <AvatarSkeleton />
            </div>
          )}

          {/* Authenticated */}
          {!showAuthSkeleton && isAuthenticated && (
            <div className="flex items-center gap-3">
              {/* Buy / Sell */}
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

              {/* Profile */}
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <button className="rounded-full">
                    <Avatar className="border-brand-100 h-10 w-10 border shadow-sm">
                      <AvatarImage src={user?.profileImage} />

                      <AvatarFallback className="bg-slate-100 text-xs font-semibold">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>

                {/* Popover Content */}
                <PopoverContent align="end" className="w-64 rounded-xl p-0">
                  {/* User Info */}
                  <div className="flex items-center gap-2 border-b p-3">
                    <Avatar className="border-brand-100 size-10 border shadow-sm">
                      <AvatarImage src={user?.profileImage} />

                      <AvatarFallback className="bg-slate-100 text-xs font-semibold">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{user?.name || 'User'}</p>

                      <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="space-y-1 p-3">
                    {userNav.map((item) => {
                      const isActive =
                        item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm transition ${
                            isActive
                              ? 'bg-brand-50 text-primary font-medium'
                              : 'hover:bg-brand-50 hover:text-primary text-slate-500'
                          }`}
                        >
                          <item.icon className="size-4" />
                          {item.label}
                        </Link>
                      );
                    })}

                    {/* Logout */}
                    <button
                      onClick={() => logout()}
                      disabled={isLogoutLoading}
                      className="text-destructive flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm transition hover:bg-red-50 disabled:cursor-not-allowed"
                    >
                      {isLogoutLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Signing out...
                        </>
                      ) : (
                        <>
                          <LogOut className="size-4" />
                          Sign out
                        </>
                      )}
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Guest */}
          {!showAuthSkeleton && !isAuthenticated && (
            <div className="flex items-center gap-2">
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
      </div>

      {/* Bottom Nav */}
      {!(pathname.startsWith('/buyer') || pathname.startsWith('/seller')) && (
        <nav className="border-brand-50 hidden border-t bg-white lg:block">
          <ul className="app-container flex h-10 items-center gap-5">
            {nav.map((item) => {
              const isActive = category
                ? item.href.includes(`category=${category}`)
                : pathname === item.href;

              return (
                <li key={item.label} className="relative flex h-full items-center">
                  <Link
                    href={item.href}
                    className={`relative flex h-full items-center px-2 text-[14px] font-medium transition ${
                      isActive ? 'bg-brand-50 text-primary' : 'hover:text-primary text-slate-500'
                    }`}
                  >
                    {item.label}

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
