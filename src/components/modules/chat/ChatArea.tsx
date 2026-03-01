'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { User, Loader2, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChatMessage as ChatMessageType, ChatUser } from '@/types/chat';

// Pre-computed at module load time — outside React render, so no purity violation
const SKELETON_WIDTHS = Array.from({ length: 6 }, () => 100 + Math.random() * 120);

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
  hideBackButton?: boolean;
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
  hideBackButton = false,
}: ChatAreaProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);
  const scrollHeightBeforeLoadRef = useRef(0);
  const wasLoadingRef = useRef(false);
  const isLoadingOlderRef = useRef(false);

  // Helper: scroll the messages container to the very bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, []);

  // Preserve scroll position when loading older messages (infinite scroll)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // When starting to load older messages, save current scroll height
    if (isLoadingMessages && !wasLoadingRef.current) {
      scrollHeightBeforeLoadRef.current = container.scrollHeight;
      wasLoadingRef.current = true;
      isLoadingOlderRef.current = messages.length > 0;
    }

    // After loading finishes, restore scroll position
    if (!isLoadingMessages && wasLoadingRef.current && scrollHeightBeforeLoadRef.current > 0) {
      if (isLoadingOlderRef.current) {
        // Loading older messages: preserve scroll position
        requestAnimationFrame(() => {
          const newHeight = container.scrollHeight;
          const heightDifference = newHeight - scrollHeightBeforeLoadRef.current;
          if (heightDifference > 0) {
            container.scrollTop += heightDifference;
          }
          scrollHeightBeforeLoadRef.current = 0;
          wasLoadingRef.current = false;
          isLoadingOlderRef.current = false;
        });
      } else {
        // Initial load: scroll to bottom
        scrollToBottom();
        scrollHeightBeforeLoadRef.current = 0;
        wasLoadingRef.current = false;
        isLoadingOlderRef.current = false;
      }
    }
  }, [isLoadingMessages, messages.length, scrollToBottom]);

  // Auto-scroll to bottom when new messages arrive (sent or received)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingMessages) return;

    if (messages.length > prevMessagesLengthRef.current) {
      if (prevMessagesLengthRef.current === 0) {
        // First batch of messages loaded → always scroll to bottom
        scrollToBottom();
      } else {
        // New message arrived → check if near bottom or if it's own message
        const isNearBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 200;
        if (isNearBottom) {
          scrollToBottom();
        }
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, isLoadingMessages, scrollToBottom]);

  // Reset prevMessagesLength when activeUser changes (room switch)
  useEffect(() => {
    prevMessagesLengthRef.current = 0;
  }, [activeUser?.roomId]);

  // Scroll handler for infinite scroll (load older messages)
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (container.scrollTop < 100 && hasMoreMessages && !isLoadingMessages) {
      onLoadMore();
    }
  }, [hasMoreMessages, isLoadingMessages, onLoadMore]);

  // Wrap onSendMessage to also scroll to bottom after sending
  const handleSend = useCallback(
    (text?: string, images?: string[]) => {
      onSendMessage(text, images);
      // Scroll to bottom immediately on send
      scrollToBottom();
    },
    [onSendMessage, scrollToBottom],
  );

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
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
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
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-brand-100 flex items-center gap-3 border-b bg-white px-3 py-3 sm:px-4">
        {/* Back button (mobile) */}
        {!hideBackButton && (
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
        )}

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
          <div className="space-y-4 p-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`flex gap-2 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                {i % 2 === 0 && <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200" />}
                <div className={`space-y-1 ${i % 2 === 0 ? '' : 'flex flex-col items-end'}`}>
                  <div
                    className="h-9 animate-pulse rounded-2xl bg-slate-200"
                    style={{ width: `${SKELETON_WIDTHS[i]}px` }}
                  />
                  <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
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
          groupedMessages.map((group, groupIdx) => (
            <div key={`${group.date}-${groupIdx}`}>
              {/* Date Separator */}
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-400 shadow-sm">
                  {group.date}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Messages */}
              <div className="space-y-1">
                {group.messages.map((msg, idx) => {
                  const isOwn = msg.senderId === currentUserId;

                  // Show avatar for first message or if previous was from different sender
                  const prevMsg = group.messages[idx - 1];
                  const isSameSenderAsPrev = prevMsg && msg.senderId === prevMsg.senderId;
                  const showAvatar = !isOwn && !isSameSenderAsPrev;

                  return (
                    <div key={msg.id} className={isSameSenderAsPrev ? '' : 'pt-2'}>
                      <ChatMessage message={msg} isOwn={isOwn} showAvatar={showAvatar} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} isSending={isSending} />
    </div>
  );
}
