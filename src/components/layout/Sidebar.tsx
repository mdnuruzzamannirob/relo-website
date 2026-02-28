'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Star,
  LayoutDashboard,
  Package,
  MessageSquare,
  Handshake,
  Truck,
  DollarSign,
  Heart,
  Plus,
} from 'lucide-react';
import { NavigationLink } from '@/types';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/lib/utils/getInitials';

const navigationLinksByVariant: Record<string, NavigationLink[]> = {
  seller: [
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
      label: 'Offers',
      icon: Handshake,
      href: '/seller/offers',
    },
    {
      label: 'Messages',
      icon: MessageSquare,
      href: '/seller/messages',
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
  ],
  buyer: [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/buyer/overview',
    },
    {
      label: 'My Orders',
      icon: Package,
      href: '/buyer/my-orders',
    },
    {
      label: 'Offers',
      icon: Handshake,
      href: '/buyer/offers',
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
  ],
};

const Sidebar = ({
  variant = 'seller',
  navigationLinks,
}: {
  info: { name: string; type: string; rating: number };
  variant?: 'seller' | 'buyer';
  navigationLinks?: NavigationLink[];
}) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const links = navigationLinks || navigationLinksByVariant[variant];

  return (
    <aside className="border-brand-100 sticky top-27.5 hidden h-fit w-65 rounded-xl border bg-white p-6 lg:block">
      {/* User */}
      <div className="border-brand-50 mb-5 flex items-center gap-3 border-b pb-5">
        <Avatar className="border-brand-100 size-10 border shadow-sm">
          <AvatarImage src={user?.profileImage} className="object-cover" />

          <AvatarFallback className="bg-slate-100 text-xs font-semibold">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-primary truncate text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.type?.toLowerCase()} Dashboard</p>
          {/* <div className="flex items-center gap-1 text-xs text-yellow-500">
            <Star className="h-3 w-3 fill-yellow-500" />
            <span>{info.rating}</span>
          </div> */}
        </div>
      </div>

      {variant === 'seller' && (
        <Link href="/seller/my-listings/new-listing">
          <Button className="w-full">
            <Plus /> New Listing
          </Button>
        </Link>
      )}

      {/* Menu */}
      <nav className="mt-4 space-y-1">
        {links?.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.includes(href);

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
  );
};

export default Sidebar;
