import { Home, LayoutDashboard, Settings } from 'lucide-react';

export const nav = [
  { label: 'Woman', href: '/products?category=woman', slug: 'woman' },
  { label: 'Men', href: '/products?category=men', slug: 'men' },
  { label: 'Kids', href: '/products?category=kids', slug: 'kids' },
  { label: 'Electronics', href: '/products?category=electronics', slug: 'electronics' },
  { label: 'Products', href: '/products' },
  { label: 'About Us', href: '/about-us' },
  // { label: 'Contact Us', href: '/contact-us' },
];

export const userNav = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
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
