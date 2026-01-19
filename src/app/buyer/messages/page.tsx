import Message from '@/components/modules/buyer/Message';
import HeaderBar from '@/components/shared/HeaderBar';

export const metadata = {
  title: 'Messages - Buyer Dashboard',
  description: 'Buyer Messages page',
};

const MessagesPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="Messages" description="Communicate with sellers" />
      <Message />
    </section>
  );
};

export default MessagesPage;
