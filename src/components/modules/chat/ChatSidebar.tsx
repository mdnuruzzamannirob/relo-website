'use client';

import Image from 'next/image';
import { Search, User } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { ChatUser } from '@/types/chat';

interface ChatSidebarProps {
  chatUsers: ChatUser[];
  activeRoomId: string | null;
  isLoading: boolean;
  onSelectUser: (user: ChatUser) => void;
  isUserOnline: (userId: string) => boolean;
}

export default function ChatSidebar({
  chatUsers,
  activeRoomId,
  isLoading,
  onSelectUser,
  isUserOnline,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return chatUsers;
    const q = searchQuery.toLowerCase();
    return chatUsers.filter((u) => u.user.name.toLowerCase().includes(q));
  }, [chatUsers, searchQuery]);

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Search */}
      <div className="p-3">
        <div className="border-brand-100 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-3 rounded-lg p-2">
                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-2.5 w-32 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-brand-50 mb-3 rounded-full p-3">
              <Search className="text-brand-400 h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {searchQuery ? 'Try a different search' : 'Start a conversation from a product page'}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredUsers.map((chatUser) => {
              const online = isUserOnline(chatUser.user.id);
              const isActive = chatUser.roomId === activeRoomId;
              const lastMsgText =
                chatUser.lastMessage?.message ||
                (chatUser.lastMessage?.images?.length ? '📷 Image' : 'No messages yet');

              return (
                <button
                  key={chatUser.roomId}
                  onClick={() => onSelectUser(chatUser)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    isActive ? 'bg-brand-100/70' : 'hover:bg-brand-50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {chatUser.user.profileImage ? (
                      <Image
                        src={chatUser.user.profileImage}
                        alt={chatUser.user.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-brand-100 text-brand-600 flex h-10 w-10 items-center justify-center rounded-full">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    {/* Online indicator */}
                    {online && (
                      <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {chatUser.user.name}
                      </p>
                      {chatUser.lastMessage?.createdAt && (
                        <span className="shrink-0 text-[10px] text-slate-400">
                          {formatTime(chatUser.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-slate-500">{lastMsgText}</p>
                      {chatUser.unreadMessageCount > 0 && (
                        <span className="bg-primary flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white">
                          {chatUser.unreadMessageCount > 9 ? '9+' : chatUser.unreadMessageCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
