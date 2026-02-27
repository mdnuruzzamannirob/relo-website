import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, ChatUser, ChatMessage, UserStatusEvent } from '@/types/chat';

const getMessageTimestamp = (createdAt: string) => {
  if (!createdAt) return 0;
  const numeric = Number(createdAt);
  if (!Number.isNaN(numeric)) {
    return numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
  }
  const parsed = Date.parse(createdAt);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const compareMessages = (a: ChatMessage, b: ChatMessage) => {
  const timeDiff = getMessageTimestamp(a.createdAt) - getMessageTimestamp(b.createdAt);
  if (timeDiff !== 0) return timeDiff;
  return a.id.localeCompare(b.id);
};

const initialState: ChatState = {
  chatUsers: [],
  activeRoomId: null,
  activeReceiverId: null,
  messages: [],
  isConnected: false,
  isAuthenticated: false,
  isLoadingUsers: false,
  isLoadingMessages: false,
  isSending: false,
  hasMoreMessages: true,
  currentPage: 1,
  onlineUsers: {},
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ── Connection ────────────────────────────────────────────────────────
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (!action.payload) {
        state.isAuthenticated = false;
      }
    },

    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    // ── Chat Users ────────────────────────────────────────────────────────
    setLoadingUsers: (state, action: PayloadAction<boolean>) => {
      state.isLoadingUsers = action.payload;
    },

    setChatUsers: (state, action: PayloadAction<ChatUser[]>) => {
      state.chatUsers = action.payload;
      state.isLoadingUsers = false;
    },

    // ── Active Room ───────────────────────────────────────────────────────
    setActiveRoom: (state, action: PayloadAction<{ roomId: string; receiverId: string }>) => {
      state.activeRoomId = action.payload.roomId;
      state.activeReceiverId = action.payload.receiverId;
      state.messages = [];
      state.currentPage = 1;
      state.hasMoreMessages = true;
    },

    clearActiveRoom: (state) => {
      state.activeRoomId = null;
      state.activeReceiverId = null;
      state.messages = [];
      state.currentPage = 1;
      state.hasMoreMessages = true;
    },

    // ── Messages ──────────────────────────────────────────────────────────
    setLoadingMessages: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMessages = action.payload;
    },

    setMessages: (
      state,
      action: PayloadAction<{
        messages: ChatMessage[];
        page: number;
        hasMore: boolean;
      }>,
    ) => {
      const { messages, page, hasMore } = action.payload;

      if (page === 1) {
        // Spread into new array so Immer tracks correctly, then sort oldest→newest
        state.messages = [...messages].sort(compareMessages);
      } else {
        // Merge without duplicates
        const existingIds = new Set(state.messages.map((m) => m.id));
        const newMessages = messages.filter((m) => !existingIds.has(m.id));
        state.messages = [...newMessages, ...state.messages].sort(compareMessages);
      }

      state.currentPage = page;
      state.hasMoreMessages = hasMore;
      state.isLoadingMessages = false;
    },

    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const msg = action.payload;
      // Avoid duplicate messages
      const exists = state.messages.some((m) => m.id === msg.id);
      if (!exists) {
        // Spread into new sorted array so Immer tracks correctly
        state.messages = [...state.messages, msg].sort(compareMessages);
      }

      // Update last message in chat users list
      const chatUser = state.chatUsers.find((u) => u.roomId === msg.roomId);
      if (chatUser) {
        chatUser.lastMessage = msg;
        // Move this user to top of list
        const idx = state.chatUsers.indexOf(chatUser);
        if (idx > 0) {
          state.chatUsers.splice(idx, 1);
          state.chatUsers.unshift(chatUser);
        }
        // Increment unread if message is not from active room
        if (msg.roomId !== state.activeRoomId) {
          chatUser.unreadMessageCount = (chatUser.unreadMessageCount || 0) + 1;
        }
      }
    },

    setSending: (state, action: PayloadAction<boolean>) => {
      state.isSending = action.payload;
    },

    // ── User Status ───────────────────────────────────────────────────────
    updateUserStatus: (state, action: PayloadAction<UserStatusEvent>) => {
      const { userId, isOnline } = action.payload;
      state.onlineUsers[userId] = isOnline;

      // Update in chat users list
      const chatUser = state.chatUsers.find((u) => u.user.id === userId);
      if (chatUser) {
        chatUser.isOnline = isOnline;
      }
    },

    // ── Unread Count ──────────────────────────────────────────────────────
    clearUnreadCount: (state, action: PayloadAction<string>) => {
      const chatUser = state.chatUsers.find((u) => u.roomId === action.payload);
      if (chatUser) {
        chatUser.unreadMessageCount = 0;
      }
    },

    // ── Error ─────────────────────────────────────────────────────────────
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // ── Reset ─────────────────────────────────────────────────────────────
    resetChat: () => initialState,
  },
});

export const {
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
} = chatSlice.actions;

export default chatSlice.reducer;
