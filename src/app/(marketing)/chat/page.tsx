'use client';

import HeaderBar from '@/components/shared/HeaderBar';
import { Send } from 'lucide-react';
import Image from 'next/image';

const conversations = {
  id: 'c1',
  user: {
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/100?img=47',
  },
  product: {
    title: 'Woman Bag',
    size: 'M',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
  },
  messages: [
    {
      id: 'm1',
      type: 'offer',
      price: 62.99,
      note: 'This is my last price friend',
      time: '2025-01-10 10:18am',
      from: 'seller',
    },
    {
      id: 'm2',
      type: 'text',
      text: 'Sorry price very high.',
      time: '2025-01-10 10:20am',
      from: 'buyer',
    },
  ],
};

const ChatPage = () => {
  return (
    <section className="app-container min-h-[calc(100vh-119px)] space-y-6 pt-8 pb-14">
      <HeaderBar title="Messages" description="Communicate with Admin" />

      <main className="border-brand-100 flex flex-1 flex-col rounded-xl border">
        {/* Header */}
        <div className="border-brand-100 flex items-center gap-3 border-b p-4">
          <Image
            src={conversations.user.avatar}
            alt={conversations.user.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{conversations.user.name}</p>
            <p className="text-xs text-slate-500">{conversations.product.title}</p>
          </div>
        </div>

        {/* Product Card */}
        <div className="p-4">
          <div className="bg-primary flex items-center justify-between rounded-lg p-3 text-white">
            <div className="flex items-center gap-3">
              <Image
                src={conversations.product.image}
                alt="product"
                width={56}
                height={56}
                className="rounded-md object-cover"
              />
              <div>
                <p className="text-sm font-medium">{conversations.product.title}</p>
                <p className="text-xs opacity-80">Size: {conversations.product.size}</p>
              </div>
            </div>
            <p className="text-sm font-semibold">${conversations.product.price}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4">
          {conversations.messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === 'buyer' ? 'justify-end' : 'justify-start'}`}
            >
              {m.type === 'offer' ? (
                <div className="bg-brand-50 border-brand-100 w-56 rounded-lg border p-3 text-sm">
                  <p className="font-medium">$ Offer</p>
                  <p className="text-lg font-semibold">${m.price}</p>
                  <p className="text-xs text-slate-500">{m.note}</p>
                </div>
              ) : (
                <div className="bg-primary max-w-xs rounded-lg px-3 py-2 text-sm text-white">
                  <p>{m.text}</p>
                  <p className="mt-1 text-[10px] opacity-70">{m.time}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-brand-100 mt-3 border-t p-3">
          <div className="border-brand-100 flex items-center gap-2 rounded-md border px-3 py-2">
            <input placeholder="Type here..." className="flex-1 text-sm outline-none" />
            <button className="bg-primary rounded-md p-2 text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </section>
  );
};

export default ChatPage;
