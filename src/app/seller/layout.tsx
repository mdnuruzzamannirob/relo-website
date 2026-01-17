'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Handshake,
  Truck,
  DollarSign,
  Star,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SellerLayoutProps = {
  children: ReactNode;
};

export default function SellerLayout({ children }: SellerLayoutProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/seller/overview',
    },
    {
      label: 'My Listings',
      icon: Package,
      href: '/seller/my-listings',
    },
    {
      label: 'Messages',
      icon: MessageSquare,
      href: '/seller/messages',
    },
    {
      label: 'Offers',
      icon: Handshake,
      href: '/seller/offers',
    },
    {
      label: 'Orders & Pickup',
      icon: Truck,
      href: '/seller/orders-and-pickup',
    },
    {
      label: 'Earnings',
      icon: DollarSign,
      href: '/seller/earnings',
    },
    {
      label: 'Rating',
      icon: Star,
      href: '/seller/rating',
    },
  ];

  return (
    <div className="bg-brand-50">
      <div className="app-container flex min-h-[calc(100vh-81px)] gap-8 pt-8 pb-14">
        {/* Sidebar */}
        <aside className="border-brand-100 sticky top-28.25 h-fit w-65 rounded-xl border bg-white p-6">
          {/* User */}
          <div className="mb-10 flex items-center gap-3">
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
