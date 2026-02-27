'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
  showAvatar?: boolean;
}

export default function ChatMessage({ message, isOwn, showAvatar }: ChatMessageProps) {
  const senderName = message.sender?.name || '';
  const senderAvatar = message.sender?.profileImage;

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const hasImages = message.images && message.images.length > 0;
  const hasText = message.message && message.message.trim().length > 0;

  return (
    <div className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {/* Other user's avatar */}
      {!isOwn && showAvatar && (
        <div className="mt-auto shrink-0">
          {senderAvatar ? (
            <Image
              src={senderAvatar}
              alt={senderName}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="bg-brand-100 text-brand-600 flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium">
              {senderName?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      )}

      {/* Message Bubble - reserve space even when avatar hidden */}
      {!isOwn && !showAvatar && <div className="w-7 shrink-0" />}

      <div
        className={`flex max-w-[80%] flex-col sm:max-w-xs ${isOwn ? 'items-end' : 'items-start'}`}
      >
        {/* Images */}
        {hasImages && (
          <div className={`mb-1 flex flex-wrap gap-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {message.images!.map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src={img}
                  alt={`image-${idx}`}
                  width={200}
                  height={200}
                  className="max-h-48 w-auto object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Text */}
        {hasText && (
          <div
            className={`inline-block rounded-2xl px-3.5 py-2 text-sm ${
              isOwn
                ? 'bg-primary rounded-br-md text-white'
                : 'bg-brand-50 border-brand-100 rounded-bl-md border text-slate-800'
            }`}
          >
            <p className="wrap-break-word whitespace-pre-wrap">{message.message}</p>
          </div>
        )}

        {/* Time */}
        <div
          className={`mt-0.5 flex items-center gap-1 ${isOwn ? 'justify-end' : 'justify-start'}`}
        >
          <span className="text-[10px] text-slate-400">{formattedTime}</span>
          {isOwn && <Check className="h-3 w-3 text-slate-400" />}
        </div>
      </div>
    </div>
  );
}
