'use client';

import HeaderBar from '@/components/shared/HeaderBar';
import { ChatContainer } from '@/components/modules/chat';

const ChatPage = () => {
  return (
    <section className="app-container min-h-[calc(100vh-119px)] space-y-6 pt-8 pb-14">
      <HeaderBar title="Messages" description="Communicate with Admin" />
      <ChatContainer variant="buyer" />
    </section>
  );
};

export default ChatPage;
