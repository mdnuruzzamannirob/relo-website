'use client';

import { Suspense } from 'react';
import { ChatContainer } from '@/components/modules/chat';

export default function Messages() {
  return (
    <Suspense>
      <ChatContainer variant="buyer" />
    </Suspense>
  );
}
