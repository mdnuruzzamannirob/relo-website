'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, ShoppingBag, MessageSquare, Heart, Star } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type BuyerLayoutProps = {
  children: ReactNode;
};

export default function BuyerLayout({ children }: BuyerLayoutProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/buyer/overview',
    },
    {
      label: 'My Orders',
      icon: ShoppingBag,
      href: '/buyer/my-orders',
    },
    {
      label: 'Messages',
      icon: MessageSquare,
      href: '/buyer/messages',
    },
    {
      label: 'Favorites',
      icon: Heart,
      href: '/buyer/favorites',
    },
    {
      label: 'Reviews',
      icon: Star,
      href: '/buyer/reviews',
    },
  ];

  return (
    <div className="bg-brand-50">
      <div className="app-container flex min-h-[calc(100vh-81px)] gap-8 pt-8 pb-14">
        {/* Sidebar */}
        <aside className="border-brand-100 sticky top-28.25 h-fit w-65 rounded-xl border bg-white p-6">
          {/* User */}
          <div className="border-brand-50 mb-5 flex items-center gap-3 border-b pb-5">
            <div className="bg-brand-50 h-11 w-11 rounded-full" />
            <div>
              <p className="text-primary text-sm font-semibold">John Doe</p>
              <p className="text-xs text-slate-500">Buyer Dashboard</p>
              <div className="flex items-center gap-1 text-xs text-yellow-500">
                <Star className="h-3 w-3 fill-yellow-500" />
                <span>4.8</span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-brand-50 text-primary font-medium'
                      : 'hover:bg-brand-50 hover:text-primary text-slate-500'
                  }`}
                >
                  <Icon className={`size-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
