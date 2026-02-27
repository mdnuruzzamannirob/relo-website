import Message from '@/components/modules/buyer/Message';
import HeaderBar from '@/components/shared/HeaderBar';

export const metadata = {
  title: 'Messages - Buyer Dashboard',
  description: 'Buyer Messages page',
};

const MessagesPage = () => {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col sm:h-[calc(100vh-11rem)] lg:h-[calc(100vh-8rem)]">
      <HeaderBar title="Messages" description="Communicate with sellers" />
      <div className="mt-4 min-h-0 flex-1">
        <Message />
      </div>
    </div>
  );
};

export default MessagesPage;
