// WebSocket STOMP 서비스
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { ChatMessage } from './chatApi';
import { API_CONFIG, WEBSOCKET_CONFIG } from '../config/api';

// SockJS 대신 네이티브 WebSocket 사용
const createWebSocket = (url: string) => {
  return new WebSocket(url.replace('http', 'ws'));
};

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface WebSocketMessage {
  type: 'message' | 'error' | 'connection';
  data?: any;
  error?: string;
}

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private messageHandlers: Map<string, (message: ChatMessage) => void> = new Map();
  private connectionHandlers: Set<(connected: boolean) => void> = new Set();

  // WebSocket 연결
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client?.connected) {
        resolve();
        return;
      }

      try {
        // 네이티브 WebSocket 사용
        const socket = createWebSocket(`${API_BASE_URL}/ws-stomp`);
        this.client = new Client({
          webSocketFactory: () => socket,
          debug: (str) => {
            console.log('STOMP Debug:', str);
          },
          onConnect: (frame) => {
            console.log('WebSocket 연결 성공:', frame);
            this.notifyConnectionHandlers(true);
            resolve();
          },
          onStompError: (frame) => {
            console.error('STOMP 오류:', frame);
            this.notifyConnectionHandlers(false);
            reject(new Error(`STOMP 오류: ${frame.headers.message}`));
          },
          onWebSocketError: (error) => {
            console.error('WebSocket 오류:', error);
            this.notifyConnectionHandlers(false);
            reject(error);
          },
          onWebSocketClose: () => {
            console.log('WebSocket 연결 종료');
            this.notifyConnectionHandlers(false);
            this.subscriptions.clear();
          },
        });

        this.client.activate();
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
        reject(error);
      }
    });
  }

  // WebSocket 연결 해제
  disconnect(): void {
    if (this.client) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions.clear();
      this.messageHandlers.clear();
      this.client.deactivate();
      this.client = null;
    }
  }

  // 채팅방 구독
  subscribeToChatRoom(chatRoomId: number, onMessage: (message: ChatMessage) => void): void {
    if (!this.client?.connected) {
      console.error('WebSocket이 연결되지 않았습니다.');
      return;
    }

    const destination = `/topic/chat/${chatRoomId}`;
    const handlerKey = `chat_${chatRoomId}`;

    // 기존 구독 해제
    this.unsubscribeFromChatRoom(chatRoomId);

    try {
      const subscription = this.client.subscribe(destination, (message: IMessage) => {
        try {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          console.log('메시지 수신:', chatMessage);
          onMessage(chatMessage);
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      });

      this.subscriptions.set(handlerKey, subscription);
      this.messageHandlers.set(handlerKey, onMessage);
      
      console.log(`채팅방 ${chatRoomId} 구독 시작`);
    } catch (error) {
      console.error(`채팅방 ${chatRoomId} 구독 실패:`, error);
    }
  }

  // 채팅방 구독 해제
  unsubscribeFromChatRoom(chatRoomId: number): void {
    const handlerKey = `chat_${chatRoomId}`;
    const subscription = this.subscriptions.get(handlerKey);
    
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(handlerKey);
      this.messageHandlers.delete(handlerKey);
      console.log(`채팅방 ${chatRoomId} 구독 해제`);
    }
  }

  // 메시지 전송
  sendMessage(chatRoomId: number, content: string): void {
    if (!this.client?.connected) {
      console.error('WebSocket이 연결되지 않았습니다.');
      throw new Error('WebSocket 연결이 필요합니다.');
    }

    const destination = `/app/chat/${chatRoomId}`;
    const message = { content };

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(message),
      });
      
      console.log(`메시지 전송: ${content} -> 채팅방 ${chatRoomId}`);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      throw error;
    }
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  // 연결 상태 변경 핸들러 등록
  onConnectionChange(handler: (connected: boolean) => void): () => void {
    this.connectionHandlers.add(handler);
    
    // 등록 해제 함수 반환
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  // 연결 상태 핸들러들에 알림
  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(connected);
      } catch (error) {
        console.error('연결 상태 핸들러 오류:', error);
      }
    });
  }

  // 모든 구독 해제
  unsubscribeAll(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.clear();
    this.messageHandlers.clear();
  }
}

// 싱글톤 인스턴스
export const webSocketService = new WebSocketService();
