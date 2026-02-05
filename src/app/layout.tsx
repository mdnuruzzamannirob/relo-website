import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';
import Provider from './provider';
import { cn } from '@/lib/utils/cn';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Relo - Your Trusted E-commerce Partner',
  description:
    'Relo is your go-to e-commerce platform for a seamless shopping experience. Discover a wide range of products, unbeatable prices, and exceptional customer service all in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={cn('antialiased', poppins.className)}>
        <Provider>
          <Navbar />
          {children}
          <Footer />
          <Toaster
            position="top-center"
            richColors
            theme="light"
            duration={3000}
            expand
            swipeDirections={['bottom', 'top', 'left', 'right']}
          />
        </Provider>
      </body>
    </html>
  );
}
