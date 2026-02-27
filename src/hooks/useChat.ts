'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import socketService from '@/lib/utils/socketService';
import {
  setConnected,
  setAuthenticated,
  setLoadingUsers,
  setChatUsers,
  setActiveRoom,
  clearActiveRoom,
  setLoadingMessages,
  setMessages,
  addMessage,
  setSending,
  updateUserStatus,
  clearUnreadCount,
  setError,
  resetChat,
} from '@/store/slices/chatSlice';
import type {
  ChatUser,
  SendMessagePayload,
  ReceiveMessageEvent,
  UserStatusEvent,
  AuthenticateResponse,
  GetMessagesResponse,
} from '@/types/chat';

const MESSAGES_PER_PAGE = 10;

export function useChat() {
  const dispatch = useAppDispatch();
  const {
    chatUsers,
    activeRoomId,
    activeReceiverId,
    messages,
    isConnected,
    isAuthenticated,
    isLoadingUsers,
    isLoadingMessages,
    isSending,
    hasMoreMessages,
    currentPage,
    onlineUsers,
    error,
  } = useAppSelector((state) => state.chat);

  const { user } = useAppSelector((state) => state.user);
  const listenersSetupRef = useRef(false);
  const authenticatedRef = useRef(false);

  // ── Fetch Chat Users ────────────────────────────────────────────────────

  const fetchChatUsers = useCallback(() => {
    dispatch(setLoadingUsers(true));
    socketService.getChatUsers((response) => {
      // Response is directly an array: [{ roomId, user, unreadMessageCount, ... }]
      const users = Array.isArray(response) ? response : [];
      dispatch(setChatUsers(users));
    });
  }, [dispatch]);

  // ── Initialize Connection ───────────────────────────────────────────────

  const initializeChat = useCallback(() => {
    if (!user) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) return;

    const socket = socketService.connect();

    // Setup connection listeners (only once)
    if (!listenersSetupRef.current) {
      socketService.onConnect(() => {
        dispatch(setConnected(true));
        dispatch(setError(null));

        // Authenticate on connect
        if (!authenticatedRef.current) {
          socketService.authenticate({ token }, (response: AuthenticateResponse) => {
            if (response?.status === true) {
              authenticatedRef.current = true;
              dispatch(setAuthenticated(true));
              fetchChatUsers();
            } else {
              dispatch(setError(response?.message || 'Authentication failed'));
            }
          });
        }
      });

      socketService.onDisconnect(() => {
        dispatch(setConnected(false));
        authenticatedRef.current = false;
      });

      socketService.onConnectError((err) => {
        const errorMsg = typeof err === 'string' ? err : err?.message || 'Connection failed';
        dispatch(setError(errorMsg));
        dispatch(setConnected(false));
      });

      // Listen for incoming messages: { message: { id, message, ... } }
      socketService.onReceiveMessage((data: ReceiveMessageEvent) => {
        if (data?.message) {
          dispatch(addMessage(data.message));
        }
      });

      // Listen for user status changes: { userId, isOnline }
      socketService.onUserStatus((status: UserStatusEvent) => {
        dispatch(updateUserStatus(status));
      });

      listenersSetupRef.current = true;
    }

    // If already connected, authenticate immediately
    if (socket.connected && !authenticatedRef.current) {
      socketService.authenticate({ token }, (response: AuthenticateResponse) => {
        if (response?.status === true) {
          authenticatedRef.current = true;
          dispatch(setAuthenticated(true));
          fetchChatUsers();
        } else {
          dispatch(setError(response?.message || 'Authentication failed'));
        }
      });
    }
  }, [user, dispatch, fetchChatUsers]);

  // ── Join Room ───────────────────────────────────────────────────────────

  const joinRoom = useCallback(
    (receiverId: string, roomId: string) => {
      dispatch(setActiveRoom({ roomId, receiverId }));
      dispatch(clearUnreadCount(roomId));
      dispatch(setLoadingMessages(true));

      // Emit joinRoom to tell the server we're in this room
      socketService.joinRoom({ receiverId });

      // Safety timeout for initial message fetch
      const timeoutId = setTimeout(() => {
        dispatch(setLoadingMessages(false));
      }, 10000);

      // Fetch initial messages
      socketService.getMessages(
        { roomId, page: 1, limit: MESSAGES_PER_PAGE },
        (response: GetMessagesResponse) => {
          clearTimeout(timeoutId);
          if (response?.messages) {
            const msgs = Array.isArray(response.messages) ? response.messages : [];
            const hasMore = response.meta
              ? response.meta.page < response.meta.totalPage
              : msgs.length === MESSAGES_PER_PAGE;
            dispatch(setMessages({ messages: msgs, page: 1, hasMore }));
          } else {
            dispatch(setMessages({ messages: [], page: 1, hasMore: false }));
          }
        },
      );
    },
    [dispatch],
  );

  // ── Load More Messages ──────────────────────────────────────────────────

  const loadMoreMessages = useCallback(() => {
    if (!activeRoomId || isLoadingMessages || !hasMoreMessages) return;

    const nextPage = currentPage + 1;
    dispatch(setLoadingMessages(true));

    // Safety timeout - reset loading state if socket doesn't respond
    const timeoutId = setTimeout(() => {
      dispatch(setLoadingMessages(false));
    }, 10000);

    socketService.getMessages(
      { roomId: activeRoomId, page: nextPage, limit: MESSAGES_PER_PAGE },
      (response: GetMessagesResponse) => {
        clearTimeout(timeoutId);
        if (response?.messages) {
          const msgs = Array.isArray(response.messages) ? response.messages : [];
          const hasMore = response.meta
            ? response.meta.page < response.meta.totalPage
            : msgs.length === MESSAGES_PER_PAGE;
          dispatch(setMessages({ messages: msgs, page: nextPage, hasMore }));
        } else {
          dispatch(setLoadingMessages(false));
        }
      },
    );
  }, [activeRoomId, isLoadingMessages, hasMoreMessages, currentPage, dispatch]);

  // ── Send Message ────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    (text?: string, images?: string[]) => {
      if (!activeRoomId) return;
      if (!text?.trim() && (!images || images.length === 0)) return;

      dispatch(setSending(true));

      const payload: SendMessagePayload = {
        chatRoomId: activeRoomId,
      };
      if (text?.trim()) {
        payload.message = text.trim();
      }
      if (images && images.length > 0) {
        payload.images = images;
      }

      // Just emit; the response comes back via receiveMessage event
      socketService.sendMessage(payload);

      // Reset sending after a short delay (will be received via receiveMessage)
      setTimeout(() => {
        dispatch(setSending(false));
      }, 500);
    },
    [activeRoomId, dispatch],
  );

  // ── Leave Room ──────────────────────────────────────────────────────────

  const leaveRoom = useCallback(() => {
    dispatch(clearActiveRoom());
  }, [dispatch]);

  // ── Cleanup ─────────────────────────────────────────────────────────────

  const disconnectChat = useCallback(() => {
    socketService.disconnect();
    listenersSetupRef.current = false;
    authenticatedRef.current = false;
    dispatch(resetChat());
  }, [dispatch]);

  // ── Auto-initialize on mount ────────────────────────────────────────────

  useEffect(() => {
    if (user && !isConnected && !listenersSetupRef.current) {
      initializeChat();
    }

    return () => {
      // Don't disconnect on unmount to keep connection alive across pages
    };
  }, [user, isConnected, initializeChat]);

  // ── Helper: get current user ID ─────────────────────────────────────────

  const currentUserId = user?.id || '';

  // ── Helper: check if a user is online ───────────────────────────────────

  const isUserOnline = useCallback((userId: string) => !!onlineUsers[userId], [onlineUsers]);

  return {
    // State
    chatUsers,
    activeRoomId,
    activeReceiverId,
    messages,
    isConnected,
    isAuthenticated,
    isLoadingUsers,
    isLoadingMessages,
    isSending,
    hasMoreMessages,
    currentUserId,
    error,

    // Actions
    initializeChat,
    fetchChatUsers,
    joinRoom,
    loadMoreMessages,
    sendMessage,
    leaveRoom,
    disconnectChat,
    isUserOnline,
  };
}
