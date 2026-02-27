'use client';

import { Suspense } from 'react';
import HeaderBar from '@/components/shared/HeaderBar';
import { ChatContainer } from '@/components/modules/chat';

const ChatPage = () => {
  return (
    <section className="app-container min-h-[calc(100vh-119px)] space-y-6 pt-8 pb-14">
      <HeaderBar title="Messages" description="Communicate with Admin" />
      <Suspense>
        <ChatContainer variant="buyer" />
      </Suspense>
    </section>
  );
};

export default ChatPage;
