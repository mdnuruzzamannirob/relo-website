import MobileSidebar from '@/components/layout/MobileSidebar';
import Sidebar from '@/components/layout/Sidebar';

export const metadata = {
  title: 'Seller Dashboard',
  description: 'Manage your seller account, view listings, messages, and earnings.',
};

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const info = { name: 'John Doe', type: 'Seller', rating: 4.5 };

  return (
    <div className="bg-brand-50">
      <div className="app-container flex min-h-[calc(100vh-81px)] gap-8 pt-8 pb-14">
        {/* Sidebar */}
        <Sidebar info={info} variant="seller" />

        {/* Mobile Sidebar */}
        <MobileSidebar info={info} variant="seller" />

        {/* Main Content */}
        <main className="flex-1 pt-8 lg:pt-0">{children}</main>
      </div>
    </div>
  );
}
