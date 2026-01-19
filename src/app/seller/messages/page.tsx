import Message from '@/components/modules/seller/Message';
import HeaderBar from '@/components/shared/HeaderBar';

export const metadata = {
  title: 'Messages - Seller Dashboard',
  description: 'Seller Messages page',
};

const MessagesPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="Messages" description="Communicate with buyers" />
      <Message />
    </section>
  );
};

export default MessagesPage;
