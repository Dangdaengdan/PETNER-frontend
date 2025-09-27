import { useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '@/api/chat';

interface UseWebSocketProps {
  onMessage?: (message: ChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useWebSocket = ({
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketProps = {}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const isConnectedRef = useRef(false);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  // WebSocket 연결
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket이 이미 연결되어 있습니다.');
      return;
    }

    try {
      const ws = new WebSocket(`ws://localhost:8080/ws-stomp`);
      
      ws.onopen = () => {
        console.log('WebSocket 연결 성공');
        isConnectedRef.current = true;
        
        // STOMP CONNECT 프레임 전송
        ws.send('CONNECT\naccept-version:1.0,1.1,2.0\n\n\0');
        
        onConnect?.();
      };

      ws.onclose = () => {
        console.log('WebSocket 연결 해제');
        isConnectedRef.current = false;
        subscriptionsRef.current.clear();
        onDisconnect?.();
      };

      ws.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        onError?.(error);
      };

      ws.onmessage = (event) => {
        const data = event.data;
        console.log('WebSocket 수신된 원본 데이터:', data);
        
        // STOMP 메시지 파싱
        if (data.startsWith('MESSAGE')) {
          console.log('MESSAGE 프레임 감지됨');
          try {
            const lines = data.split('\n');
            const bodyIndex = lines.findIndex(line => line === '') + 1;
            const messageBody = lines.slice(bodyIndex).join('\n').replace(/\0$/, '');
            
            console.log('파싱된 메시지 바디:', messageBody);
            
            if (messageBody) {
              const messageData: ChatMessage = JSON.parse(messageBody);
              console.log('WebSocket 메시지 수신:', messageData);
              onMessage?.(messageData);
            }
          } catch (error) {
            console.error('메시지 파싱 오류:', error);
          }
        } else if (data.startsWith('CONNECTED')) {
          console.log('STOMP CONNECTED 프레임 수신');
        } else {
          console.log('기타 WebSocket 메시지:', data);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket 연결 중 오류:', error);
      onError?.(error);
    }
  }, [onConnect, onDisconnect, onError, onMessage]);

  // WebSocket 연결 해제
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      isConnectedRef.current = false;
      subscriptionsRef.current.clear();
    }
  }, []);

  // 채팅방 구독
  const subscribeToChatRoom = useCallback(
    (chatRoomId: number) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.error('WebSocket이 연결되지 않았습니다.');
        return null;
      }

      const destination = `/topic/chat/${chatRoomId}`;
      
      // STOMP SUBSCRIBE 프레임 전송
      const subscribeFrame = `SUBSCRIBE\ndestination:${destination}\nid:sub-${chatRoomId}\n\n\0`;
      console.log(`WebSocket 구독 프레임 전송:`, subscribeFrame);
      wsRef.current.send(subscribeFrame);
      
      subscriptionsRef.current.add(destination);
      console.log(`채팅방 ${chatRoomId} 구독 시작 - destination: ${destination}`);
      
      return { unsubscribe: () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const unsubscribeFrame = `UNSUBSCRIBE\nid:sub-${chatRoomId}\n\n\0`;
          console.log(`WebSocket 구독 해제 프레임 전송:`, unsubscribeFrame);
          wsRef.current.send(unsubscribeFrame);
          subscriptionsRef.current.delete(destination);
        }
      }};
    },
    []
  );

  // 메시지 전송
  const sendMessage = useCallback((chatRoomId: number, content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket이 연결되지 않았습니다.');
      return false;
    }

    if (!content.trim()) {
      console.error('메시지 내용이 비어있습니다.');
      return false;
    }

    try {
      // STOMP SEND 프레임 전송
      const messageBody = JSON.stringify({ content: content.trim() });
      const sendFrame = `SEND\ndestination:/app/chat/${chatRoomId}\n\n${messageBody}\0`;
      
      console.log('WebSocket SEND 프레임 전송:', sendFrame);
      console.log('메시지 바디:', messageBody);
      wsRef.current.send(sendFrame);
      console.log('메시지 전송 완료:', { chatRoomId, content });
      return true;
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      return false;
    }
  }, []);

  // 연결 상태 확인
  const isConnected = useCallback(() => {
    return wsRef.current?.readyState === WebSocket.OPEN && isConnectedRef.current;
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    subscribeToChatRoom,
    sendMessage,
    isConnected,
    client: wsRef.current,
  };
};