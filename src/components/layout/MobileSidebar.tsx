'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Star,
  LayoutDashboard,
  Package,
  MessageSquare,
  Handshake,
  Truck,
  DollarSign,
  Plus,
  Heart,
} from 'lucide-react';
import { Button } from '../ui/button';

const navigationLinksByVariant = {
  seller: [
    { label: 'Overview', icon: LayoutDashboard, href: '/seller/overview' },
    { label: 'My Listings', icon: Package, href: '/seller/my-listings' },
    { label: 'Messages', icon: MessageSquare, href: '/seller/messages' },
    { label: 'Offers', icon: Handshake, href: '/seller/offers' },
    { label: 'Orders & Pickup', icon: Truck, href: '/seller/orders-and-pickup' },
    { label: 'Earnings', icon: DollarSign, href: '/seller/earnings' },
    { label: 'Rating', icon: Star, href: '/seller/rating' },
  ],
  buyer: [
    { label: 'Overview', icon: LayoutDashboard, href: '/buyer/overview' },
    { label: 'My Orders', icon: Package, href: '/buyer/my-orders' },
    { label: 'Messages', icon: MessageSquare, href: '/buyer/messages' },
    { label: 'Favorites', icon: Heart, href: '/buyer/favorites' },
    { label: 'Reviews', icon: Star, href: '/buyer/reviews' },
  ],
};

export default function MobileSidebar({
  info,
  variant,
}: {
  info: { name: string; type: string; rating: number };
  variant: 'seller' | 'buyer';
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = navigationLinksByVariant[variant];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-24 left-4 z-40 rounded-md bg-white p-2 shadow lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 mt-20.25 h-full w-72 bg-white p-4 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* User info */}
        <div className="mb-5 flex items-center gap-3 border-b pb-5">
          <div className="h-11 w-11 rounded-full bg-slate-200" />
          <div className="min-w-0">
            <p title={info.name} className="truncate pr-10 text-sm font-semibold">
              {info.name}
            </p>
            <p className="text-xs text-slate-500">{info.type} Dashboard</p>
            <div className="flex items-center gap-1 text-xs text-yellow-500">
              <Star className="h-3 w-3 fill-yellow-500" />
              {info.rating}
            </div>
          </div>
        </div>

        {/* Seller action */}
        {variant === 'seller' && (
          <Link href="/seller/my-listings/new-listing" onClick={() => setOpen(false)}>
            <Button className="mb-4 w-full">
              <Plus /> New Listing
            </Button>
          </Link>
        )}

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-brand-50 text-primary font-medium'
                    : 'hover:bg-brand-50 hover:text-primary text-slate-500'
                }`}
              >
                <Icon className={`size-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
