'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { MessageSquare, WifiOff, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import type { ChatUser } from '@/types/chat';

interface ChatContainerProps {
  variant: 'buyer' | 'seller';
  adminOnly?: boolean;
}

export default function ChatContainer({ variant, adminOnly = false }: ChatContainerProps) {
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');

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
    createAndJoinRoom,
    loadMoreMessages,
    sendMessage,
    leaveRoom,
    isUserOnline,
  } = useChat();

  const [showChat, setShowChat] = useState(adminOnly);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const autoOpenedRef = useRef(false);

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

  // Auto-open conversation when ?userId= is present and chatUsers are loaded
  useEffect(() => {
    if (!initialUserId || isLoadingUsers || autoOpenedRef.current) return;

    // If chatUsers are loaded, try to find matching user
    const match = chatUsers.find((u) => u.user.id === initialUserId);
    if (match) {
      autoOpenedRef.current = true;
      handleSelectUser(match);
      return;
    }

    // If chatUsers finished loading but no match found, create a new room
    if (!isLoadingUsers && isAuthenticated) {
      autoOpenedRef.current = true;
      setShowChat(true);

      // Create a temporary selected user for the UI while room is being created
      const tempUser: ChatUser = {
        roomId: '',
        user: { id: initialUserId, name: 'Loading...' },
        unreadMessageCount: 0,
      };
      setSelectedUser(tempUser);

      createAndJoinRoom(initialUserId).then((response) => {
        if (response?.chatRoom?.id) {
          // Update selectedUser with the new roomId
          setSelectedUser((prev) => (prev ? { ...prev, roomId: response.chatRoom.id } : prev));
        }
      });
    }
  }, [
    initialUserId,
    chatUsers,
    isLoadingUsers,
    isAuthenticated,
    handleSelectUser,
    createAndJoinRoom,
  ]);

  // Handle back navigation (mobile)
  const handleBack = useCallback(() => {
    setShowChat(false);
    leaveRoom();
  }, [leaveRoom]);

  // Update selectedUser when chatUsers list refreshes (e.g. after creating a new room)
  useEffect(() => {
    if (!selectedUser || !chatUsers.length) return;
    const updatedUser = chatUsers.find(
      (u) => u.user.id === selectedUser.user.id || u.roomId === selectedUser.roomId,
    );
    if (updatedUser && updatedUser.user.name !== selectedUser.user.name) {
      setSelectedUser(updatedUser);
    }
  }, [chatUsers, selectedUser]);

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
      <div className="border-brand-100 flex h-full w-full items-center justify-center overflow-hidden rounded-xl border bg-white">
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
      <div className="border-brand-100 flex h-full w-full items-center justify-center overflow-hidden rounded-xl border bg-white">
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
    <div className="border-brand-100 flex h-full w-full overflow-hidden rounded-xl border bg-white">
      {/* Sidebar — hidden in adminOnly mode */}
      {!adminOnly && (
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
      )}

      {/* Chat Area */}
      <main
        className={`flex h-full flex-1 flex-col ${
          adminOnly ? 'flex' : showChat ? 'flex' : 'hidden sm:flex'
        }`}
      >
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
          hideBackButton={adminOnly}
        />
      </main>
    </div>
  );
}
