'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { MessageSquare, WifiOff, RefreshCw } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import type { ChatUser } from '@/types/chat';

interface ChatContainerProps {
  variant: 'buyer' | 'seller';
}

export default function ChatContainer({ variant }: ChatContainerProps) {
  const {
    chatUsers,
    activeRoomId,
    messages,
    isConnected,
    isAuthenticated,
    isLoadingUsers,
    isLoadingMessages,
    isSending,
    hasMoreMessages,
    currentUserId,
    error,
    initializeChat,
    joinRoom,
    loadMoreMessages,
    sendMessage,
    leaveRoom,
    isUserOnline,
  } = useChat();

  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  // Initialize chat on mount
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // Handle user selection
  const handleSelectUser = useCallback(
    (chatUser: ChatUser) => {
      setSelectedUser(chatUser);
      setShowChat(true);
      joinRoom(chatUser.user.id, chatUser.roomId);
    },
    [joinRoom],
  );

  // Handle back navigation (mobile)
  const handleBack = useCallback(() => {
    setShowChat(false);
    leaveRoom();
  }, [leaveRoom]);

  // Handle send message
  const handleSendMessage = useCallback(
    (text?: string, images?: string[]) => {
      sendMessage(text, images);
    },
    [sendMessage],
  );

  // Get active user from chatUsers list
  const activeUser = useMemo(() => {
    if (selectedUser) return selectedUser;
    return null;
  }, [selectedUser]);

  // ── Connection Error State ──────────────────────────────────────────────

  if (error && !isConnected) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="rounded-full bg-red-50 p-4">
            <WifiOff className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Connection Error</h3>
            <p className="mt-1 max-w-xs text-xs text-slate-500">{error}</p>
          </div>
          <button
            onClick={initializeChat}
            className="bg-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Connecting State ────────────────────────────────────────────────────

  if (!isAuthenticated && !error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 p-8">
          <div className="bg-brand-50 animate-pulse rounded-full p-4">
            <MessageSquare className="text-brand-400 h-8 w-8" />
          </div>
          <p className="text-sm text-slate-500">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-brand-100 flex h-full w-full overflow-hidden border bg-white">
      {/* Sidebar */}
      <aside
        className={`border-brand-100 h-full w-full shrink-0 border-r bg-white sm:w-80 lg:w-72 ${
          showChat ? 'hidden sm:block' : 'block'
        }`}
      >
        <ChatSidebar
          chatUsers={chatUsers}
          activeRoomId={activeRoomId}
          isLoading={isLoadingUsers}
          onSelectUser={handleSelectUser}
          isUserOnline={isUserOnline}
        />
      </aside>

      {/* Chat Area */}
      <main className={`flex h-full flex-1 flex-col ${showChat ? 'flex' : 'hidden sm:flex'}`}>
        <ChatArea
          activeUser={activeUser}
          messages={messages}
          currentUserId={currentUserId}
          isLoadingMessages={isLoadingMessages}
          isSending={isSending}
          hasMoreMessages={hasMoreMessages}
          isUserOnline={isUserOnline}
          onSendMessage={handleSendMessage}
          onLoadMore={loadMoreMessages}
          onBack={handleBack}
        />
      </main>
    </div>
  );
}
