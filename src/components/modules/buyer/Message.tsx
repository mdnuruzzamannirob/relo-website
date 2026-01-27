'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Send } from 'lucide-react';

// ------------------
// Fake Data
// ------------------
const conversations = [
  {
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
  },
  {
    id: 'c2',
    user: {
      name: 'Doe Johnson',
      avatar: 'https://i.pravatar.cc/100?img=32',
    },
    product: {
      title: 'Woman Bag',
      size: 'L',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    },
    messages: [],
  },
];

export default function Messages() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [showChat, setShowChat] = useState(false);
  const active = conversations.find((c) => c.id === activeId)!;

  return (
    <div className="border-brand-100 flex h-125 w-full overflow-hidden rounded-xl border bg-white sm:h-150 lg:h-150">
      {/* Sidebar */}
      <aside
        className={`border-brand-100 w-full shrink-0 border-r p-3 sm:w-80 lg:w-72 ${showChat ? 'hidden sm:block' : 'block'}`}
      >
        <div className="border-brand-100 mb-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-slate-500" />
          <input placeholder="Search messages..." className="w-full outline-none" />
        </div>

        <div className="space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveId(c.id);
                setShowChat(true);
              }}
              className={`hover:bg-brand-50 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                c.id === activeId ? 'bg-brand-50' : ''
              }`}
            >
              <Image
                src={c.user.avatar}
                alt={c.user.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{c.user.name}</p>
                <p className="text-xs text-slate-500">{c.product.title}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={`flex flex-1 flex-col ${showChat ? 'block' : 'hidden sm:flex'}`}>
        {/* Header */}
        <div className="border-brand-100 flex items-center gap-3 border-b p-3 sm:p-4">
          {/* Back button for mobile */}
          <button onClick={() => setShowChat(false)} className="sm:hidden">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <Image
            src={active.user.avatar}
            alt={active.user.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{active.user.name}</p>
            <p className="text-xs text-slate-500">{active.product.title}</p>
          </div>
        </div>

        {/* Product Card */}
        <div className="p-3 sm:p-4">
          <div className="bg-primary flex flex-col items-start justify-between gap-2 rounded-lg p-3 text-white sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Image
                src={active.product.image}
                alt="product"
                width={56}
                height={56}
                className="rounded-md object-cover"
              />
              <div>
                <p className="text-sm font-medium">{active.product.title}</p>
                <p className="text-xs opacity-80">Size: {active.product.size}</p>
              </div>
            </div>
            <p className="text-sm font-semibold sm:text-base">${active.product.price}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto px-3 sm:space-y-4 sm:px-4">
          {active.messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === 'buyer' ? 'justify-end' : 'justify-start'}`}
            >
              {m.type === 'offer' ? (
                <div className="bg-brand-50 border-brand-100 w-full max-w-xs rounded-lg border p-3 text-sm sm:w-56">
                  <p className="font-medium">$ Offer</p>
                  <p className="text-lg font-semibold">${m.price}</p>
                  <p className="text-xs text-slate-500">{m.note}</p>
                </div>
              ) : (
                <div className="bg-primary max-w-[85%] rounded-lg px-3 py-2 text-sm text-white sm:max-w-xs">
                  <p>{m.text}</p>
                  <p className="mt-1 text-[10px] opacity-70">{m.time}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-brand-100 border-t p-3">
          <div className="border-brand-100 flex items-center gap-2 rounded-md border px-3 py-2">
            <input placeholder="Type here..." className="flex-1 text-sm outline-none" />
            <button className="bg-primary rounded-md p-2 text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
