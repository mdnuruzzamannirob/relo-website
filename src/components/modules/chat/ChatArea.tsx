'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { User, Loader2, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChatMessage as ChatMessageType, ChatUser } from '@/types/chat';

interface ChatAreaProps {
  activeUser: ChatUser | null;
  messages: ChatMessageType[];
  currentUserId: string;
  isLoadingMessages: boolean;
  isSending: boolean;
  hasMoreMessages: boolean;
  isUserOnline: (userId: string) => boolean;
  onSendMessage: (text?: string, images?: string[]) => void;
  onLoadMore: () => void;
  onBack: () => void;
}

export default function ChatArea({
  activeUser,
  messages,
  currentUserId,
  isLoadingMessages,
  isSending,
  hasMoreMessages,
  isUserOnline,
  onSendMessage,
  onLoadMore,
  onBack,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      // Only auto-scroll if at the bottom or new messages added at bottom
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        if (isNearBottom || prevMessagesLengthRef.current === 0) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  // Scroll handler for infinite scroll (load older messages)
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (container.scrollTop < 50 && hasMoreMessages && !isLoadingMessages) {
      onLoadMore();
    }
  }, [hasMoreMessages, isLoadingMessages, onLoadMore]);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: ChatMessageType[] }[] = [];

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === date) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ date, messages: [msg] });
      }
    });

    return groups;
  }, [messages]);

  // ── Empty State (no active user selected) ────────────────────────────

  if (!activeUser) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="bg-brand-50 mb-4 rounded-full p-4">
          <svg
            className="text-brand-400 h-10 w-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700">Select a conversation</h3>
        <p className="mt-1 text-sm text-slate-500">
          Choose a conversation from the sidebar to start chatting
        </p>
      </div>
    );
  }

  const online = isUserOnline(activeUser.user.id);

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="border-brand-100 flex items-center gap-3 border-b bg-white px-3 py-3 sm:px-4">
        {/* Back button (mobile) */}
        <button onClick={onBack} className="text-slate-600 sm:hidden" aria-label="Back">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* User Info */}
        <div className="relative shrink-0">
          {activeUser.user.profileImage ? (
            <Image
              src={activeUser.user.profileImage}
              alt={activeUser.user.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="bg-brand-100 text-brand-600 flex h-10 w-10 items-center justify-center rounded-full">
              <User className="h-5 w-5" />
            </div>
          )}
          {online && (
            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{activeUser.user.name}</p>
          <p className="text-xs text-slate-500">
            {online ? <span className="text-green-600">Online</span> : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 px-2 py-4 sm:px-4"
      >
        {/* Load More Indicator */}
        {isLoadingMessages && messages.length > 0 && (
          <div className="mb-4 flex justify-center">
            <Loader2 className="text-brand-500 h-5 w-5 animate-spin" />
          </div>
        )}

        {hasMoreMessages && !isLoadingMessages && messages.length > 0 && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={onLoadMore}
              className="text-brand-600 hover:text-brand-700 flex items-center gap-1 text-xs transition-colors"
            >
              <ArrowUp className="h-3 w-3" />
              Load older messages
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoadingMessages && messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-brand-500 h-8 w-8 animate-spin" />
              <p className="text-sm text-slate-500">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">No messages yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          /* Message Groups */
          groupedMessages.map((group) => (
            <div key={group.date}>
              {/* Date Separator */}
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-400 shadow-sm">
                  {group.date}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Messages */}
              <div className="space-y-3">
                {group.messages.map((msg, idx) => {
                  const isOwn = msg.senderId === currentUserId;

                  // Show avatar for first message or if previous was from different sender
                  const prevMsg = group.messages[idx - 1];
                  const showAvatar = !isOwn && msg.senderId !== prevMsg?.senderId;

                  return (
                    <ChatMessage key={msg.id} message={msg} isOwn={isOwn} showAvatar={showAvatar} />
                  );
                })}
              </div>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={onSendMessage} isSending={isSending} />
    </div>
  );
}
