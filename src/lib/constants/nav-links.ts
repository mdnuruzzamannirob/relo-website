import { LayoutDashboard, Settings } from 'lucide-react';

export const nav = [
  { label: 'Woman', href: '/woman' },
  { label: 'Men', href: '/men' },
  { label: 'Kids', href: '/kids' },
  { label: 'Home', href: '/home' },
  { label: 'Electronics', href: '/electronics' },
  { label: 'About Us', href: '/about-us' },
];

export const userNav = [
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
