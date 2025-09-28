const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/chat`;

// 채팅방 관련 타입 정의
export interface ChatRoom {
  chatRoomId: number;
  otherMemberInfo: {
    memberId: number;
    nickname: string;
  };
  dogInfo?: {
    dogId: number;
    name: string;
    imageUrl?: string;
  };
  lastMessageContent?: string;
  lastMessageSentAt?: string;
}

export interface ChatMessage {
  messageId: number;
  senderId: number;
  content: string;
  sendAt: string;
  chatRoomId?: number;
}

export interface ChatRoomCreateRequest {
  otherMemberId: number;
  dogId?: number;
}

export interface ChatRoomCreateResponse {
  chatRoomId: number;
  member1Id: number;
  member2Id: number;
  dogId?: number;
  message: string;
}

export interface ChatMessageRequest {
  content: string;
}

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await fetch(`${BASE_URL}/rooms/my`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`채팅방 목록 조회 실패: ${response.status}`);
  }

  return response.json();
};

// 채팅방 생성
export const createChatRoom = async (request: ChatRoomCreateRequest): Promise<ChatRoomCreateResponse> => {
  const response = await fetch(`${BASE_URL}/rooms`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`채팅방 생성 실패: ${response.status}`);
  }

  return response.json();
};

// 채팅방 메시지 내역 조회 (페이징)
export const getChatMessages = async (
  chatRoomId: number,
  page: number = 0,
  size: number = 50
): Promise<ChatMessage[]> => {
  const response = await fetch(
    `${BASE_URL}/rooms/${chatRoomId}/messages/visible?page=${page}&size=${size}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`메시지 조회 실패: ${response.status}`);
  }

  return response.json();
};

// 채팅방 메시지 전체 조회 (페이징 없음)
export const getAllChatMessages = async (chatRoomId: number): Promise<ChatMessage[]> => {
  const response = await fetch(`${BASE_URL}/rooms/${chatRoomId}/messages/visible/all`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`메시지 전체 조회 실패: ${response.status}`);
  }

  return response.json();
};

// 채팅방 나가기
export const leaveChatRoom = async (chatRoomId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/rooms/${chatRoomId}/leave`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`채팅방 나가기 실패: ${response.status}`);
  }
};

// 채팅방 재입장
export const rejoinChatRoom = async (chatRoomId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/rooms/${chatRoomId}/rejoin`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`채팅방 재입장 실패: ${response.status}`);
  }
};

// 채팅방 활성 멤버 수 조회
export const getChatRoomMemberCount = async (chatRoomId: number): Promise<number> => {
  const response = await fetch(`${BASE_URL}/rooms/${chatRoomId}/members/count`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`멤버 수 조회 실패: ${response.status}`);
  }

  const data = await response.json();
  return data.activeMemberCount;
};