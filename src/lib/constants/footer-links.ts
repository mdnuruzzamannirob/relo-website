import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export const footerLinks = {
  help: [
    { label: 'Help Center', href: '/help-center' },
    { label: 'Selling Guide', href: '/selling-guide' },
    { label: 'Buying Guide', href: '/buying-guide' },
    { label: 'How it works', href: '/how-it-works' },
  ],
  legal: [
    { label: 'About Us', href: '/about-us' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Condition', href: '/terms-and-condition' },
    { label: 'Trust & Safety', href: '/trust-and-safety' },
  ],
};

export const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: Facebook,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: Twitter,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram,
  },
  {
    name: 'Email',
    href: 'mailto:support@relo.com',
    icon: Mail,
  },
];
