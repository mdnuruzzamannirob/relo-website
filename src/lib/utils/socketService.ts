import { io, Socket } from 'socket.io-client';
import type {
  AuthenticatePayload,
  JoinRoomPayload,
  SendMessagePayload,
  GetMessagesPayload,
  AuthenticateResponse,
  ChatUser,
  ChatMessage,
  GetMessagesResponse,
  UserStatusEvent,
  ReceiveMessageEvent,
} from '@/types/chat';

// ─── Configuration ──────────────────────────────────────────────────────────

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'https://relo-ecommerce-backend.vercel.app';

// ─── Event Names ────────────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  // Emit & listen (server responds on the same event name)
  AUTHENTICATE: 'authenticate',
  JOIN_ROOM: 'joinRoom',
  SEND_MESSAGE: 'sendMessage',
  GET_MESSAGES: 'getMessages',
  GET_CHAT_USERS: 'getChatUsers',

  // Listen-only events
  RECEIVE_MESSAGE: 'receiveMessage',
  USER_STATUS: 'userStatus',

  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const;

// ─── Singleton Socket Service ───────────────────────────────────────────────

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;

  // ── Connection ──────────────────────────────────────────────────────────

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting && this.socket) {
      return this.socket;
    }

    this.isConnecting = true;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      this.isConnecting = false;
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      this.isConnecting = false;
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  get connected(): boolean {
    return this.socket?.connected ?? false;
  }

  // ── Connection Event Listeners ──────────────────────────────────────────

  onConnect(callback: () => void): void {
    this.socket?.on(SOCKET_EVENTS.CONNECT, callback);
  }

  onDisconnect(callback: () => void): void {
    this.socket?.on(SOCKET_EVENTS.DISCONNECT, callback);
  }

  onConnectError(callback: (error: Error | string) => void): void {
    this.socket?.on(SOCKET_EVENTS.CONNECT_ERROR, callback);
  }

  // ── Persistent Event Listeners (incoming data) ─────────────────────────

  onReceiveMessage(callback: (data: ReceiveMessageEvent) => void): void {
    this.socket?.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
  }

  offReceiveMessage(): void {
    this.socket?.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
  }

  onUserStatus(callback: (data: UserStatusEvent) => void): void {
    this.socket?.on(SOCKET_EVENTS.USER_STATUS, callback);
  }

  offUserStatus(): void {
    this.socket?.off(SOCKET_EVENTS.USER_STATUS);
  }

  // ── Emit + Listen on same event (one-time response) ─────────────────────
  // The server responds by emitting back on the SAME event name.
  // We use socket.once() to capture the single response.

  authenticate(
    payload: AuthenticatePayload,
    callback: (response: AuthenticateResponse) => void,
  ): void {
    if (!this.socket) return;
    this.socket.once(SOCKET_EVENTS.AUTHENTICATE, callback);
    this.socket.emit(SOCKET_EVENTS.AUTHENTICATE, payload);
  }

  joinRoom(payload: JoinRoomPayload): void {
    this.socket?.emit(SOCKET_EVENTS.JOIN_ROOM, payload);
  }

  sendMessage(payload: SendMessagePayload): void {
    this.socket?.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
  }

  getMessages(
    payload: GetMessagesPayload,
    callback: (response: GetMessagesResponse) => void,
  ): void {
    if (!this.socket) return;
    this.socket.once(SOCKET_EVENTS.GET_MESSAGES, callback);
    this.socket.emit(SOCKET_EVENTS.GET_MESSAGES, payload);
  }

  getChatUsers(callback: (response: ChatUser[] | ChatUser) => void): void {
    if (!this.socket) return;
    this.socket.once(SOCKET_EVENTS.GET_CHAT_USERS, callback);
    this.socket.emit(SOCKET_EVENTS.GET_CHAT_USERS, {});
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
