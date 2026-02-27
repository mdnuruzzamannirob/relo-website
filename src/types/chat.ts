// ─── Socket Event Payloads ───────────────────────────────────────────────────

export interface AuthenticatePayload {
  token: string;
}

export interface JoinRoomPayload {
  receiverId: string;
}

export interface SendMessagePayload {
  chatRoomId: string;
  message?: string;
  images?: string[];
}

export interface GetMessagesPayload {
  page: number;
  limit: number;
  roomId: string;
}

// ─── API Response Shapes (matching actual backend) ──────────────────────────

export interface AuthenticateResponse {
  status: boolean;
  message: string;
}

// ─── Chat User / Conversation ───────────────────────────────────────────────

export interface ChatUserInfo {
  id: string;
  name: string;
  profileImage?: string;
}

export interface MessageSenderReceiver {
  id: string;
  name: string;
  profileImage?: string;
}

export interface ChatMessage {
  id: string;
  message?: string;
  createdAt: string;
  images: string[];
  receiverId: string;
  senderId: string;
  roomId: string;
  receiver: MessageSenderReceiver;
  sender: MessageSenderReceiver;
  offerId?: string | null;
  offerData?: unknown | null;
}

export interface ChatUser {
  roomId: string;
  user: ChatUserInfo;
  unreadMessageCount: number;
  lastMessage?: ChatMessage;
  isOnline?: boolean;
}

// ─── Paginated Messages Response ────────────────────────────────────────────

export interface GetMessagesResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  messages: ChatMessage[];
}

// ─── User Status ────────────────────────────────────────────────────────────

export interface UserStatusEvent {
  userId: string;
  isOnline: boolean;
}

// ─── Receive Message Event ──────────────────────────────────────────────────

export interface ReceiveMessageEvent {
  message: ChatMessage;
}

// ─── Chat State (Redux) ────────────────────────────────────────────────────

export interface ChatState {
  chatUsers: ChatUser[];
  activeRoomId: string | null;
  activeReceiverId: string | null;
  messages: ChatMessage[];
  isConnected: boolean;
  isAuthenticated: boolean;
  isLoadingUsers: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  hasMoreMessages: boolean;
  currentPage: number;
  onlineUsers: Record<string, boolean>;
  error: string | null;
}
