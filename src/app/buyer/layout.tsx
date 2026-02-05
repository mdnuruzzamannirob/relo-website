import MobileSidebar from '@/components/layout/MobileSidebar';
import Sidebar from '@/components/layout/Sidebar';

export const metadata = {
  title: 'Buyer Dashboard',
  description: 'Manage your buyer account, view orders, messages, and settings.',
};

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const info = { name: 'John Doe', type: 'Buyer', rating: 4.8 };

  return (
    <div className="bg-brand-50">
      <div className="app-container flex min-h-[calc(100vh-78px)] gap-8 pt-8 pb-14">
        {/* Sidebar */}
        <Sidebar info={info} variant="buyer" />

        {/* Mobile Sidebar */}
        <MobileSidebar info={info} variant="buyer" />

        {/* Content */}
        <main className="w-full flex-1 pt-8 lg:pt-0">{children}</main>
      </div>
    </div>
  );
}
