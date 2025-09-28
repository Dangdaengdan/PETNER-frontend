import { useState, useEffect, useCallback, useRef } from "react";
import { MessageCircle, X, ArrowLeft, Send, Phone, MoreVertical, Maximize2, Minimize2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/use-websocket";
import { getCurrentMember } from "@/api/auth";
import { getDogById } from "@/api/dog";
import { createDogApply } from "@/api/dogapply";
import {
  getChatRooms,
  getAllChatMessages,
  createChatRoom,
  leaveChatRoom,
  type ChatRoom,
  type ChatMessage,
  type ChatRoomCreateRequest
} from "@/api/chat";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const [dogOwnerInfo, setDogOwnerInfo] = useState<Record<number, number>>({});
  
  // 사용자별 채팅방 마지막 읽은 시간 관리
  const getLastReadTime = (chatRoomId: number): string | null => {
    if (!currentMemberId) return null;
    return localStorage.getItem(`user_${currentMemberId}_chatRoom_${chatRoomId}_lastRead`);
  };
  
  const setLastReadTime = (chatRoomId: number, time: string) => {
    if (!currentMemberId) return;
    localStorage.setItem(`user_${currentMemberId}_chatRoom_${chatRoomId}_lastRead`, time);
  };
  
  // 마지막 로그아웃 시간 관리
  const getLastLogoutTime = (): string | null => {
    if (!currentMemberId) return null;
    return localStorage.getItem(`user_${currentMemberId}_lastLogout`);
  };
  
  const setLastLogoutTime = (time: string) => {
    if (!currentMemberId) return;
    localStorage.setItem(`user_${currentMemberId}_lastLogout`, time);
  };
  
  // 로그인 시 읽음 시간 초기화
  const initializeReadTimes = (rooms: ChatRoom[], isProfileCompleted: boolean) => {
    if (!currentMemberId) return;
    
    const lastLogoutTime = getLastLogoutTime();
    
    rooms.forEach(room => {
      const existingReadTime = getLastReadTime(room.chatRoomId);
      if (!existingReadTime) {
        if (!isProfileCompleted) {
          // 프로필 미완성 = 첫 로그인, 현재 시간을 기준으로 설정
          setLastReadTime(room.chatRoomId, new Date().toISOString());
        } else if (lastLogoutTime) {
          // 재로그인하는 경우, 마지막 로그아웃 시간을 기준으로 설정
          setLastReadTime(room.chatRoomId, lastLogoutTime);
        } else {
          // 로그아웃 시간이 없는 경우, 보수적으로 메시지가 있으면 읽지 않음으로 표시
          // (프로필 완성된 사용자인데 로그아웃 기록이 없는 경우는 거의 없음)
        }
      }
    });
  };
  
  // 읽지 않은 메시지 여부 확인
  const hasUnreadMessage = (room: ChatRoom): boolean => {
    // 메시지가 없는 채팅방은 읽지 않음으로 표시하지 않음
    if (!room.lastMessageSentAt || !room.lastMessageContent) return false;
    
    const lastReadTime = getLastReadTime(room.chatRoomId);
    if (!lastReadTime) {
      // 한 번도 읽지 않았으면 읽지 않음으로 표시
      return true;
    }
    
    const lastMessageTime = new Date(room.lastMessageSentAt).getTime();
    const lastReadTimeMs = new Date(lastReadTime).getTime();
    
    return lastMessageTime > lastReadTimeMs;
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // WebSocket 훅 설정
  const {
    connect,
    disconnect,
    subscribeToChatRoom,
    sendMessage: sendWebSocketMessage,
    isConnected,
  } = useWebSocket({
    onMessage: (message) => {
      // chatRoomId가 없는 경우 현재 보고 있는 채팅방으로 간주
      const messageChatRoomId = message.chatRoomId || selectedChat;
      
      if (selectedChat === messageChatRoomId) {
        // 현재 보고 있는 채팅방의 메시지면 바로 읽음 처리
        setCurrentMessages(prev => [...prev, message]);
        setUnreadCounts(prev => ({
          ...prev,
          [messageChatRoomId]: 0
        }));
      } else {
        // 현재 보고 있지 않은 채팅방의 메시지면 읽지 않은 수 증가
        setUnreadCounts(prev => ({
          ...prev,
          [messageChatRoomId]: (prev[messageChatRoomId] || 0) + 1
        }));
      }
      
      // 새 메시지가 오면 채팅방 목록 다시 로드 (정렬 반영)
      loadChatRooms();
    },
    onConnect: () => {
      console.log('WebSocket 연결됨');
    },
    onDisconnect: () => {
      console.log('WebSocket 연결 해제됨');
    },
    onError: (error) => {
      console.error('WebSocket 오류:', error);
    },
  });

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 메시지 끝으로 스크롤
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // 메시지가 업데이트되면 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

  // 채팅방 목록 정렬 함수 (최신 메시지 시간순)
  const sortChatRooms = (rooms: ChatRoom[]) => {
    return rooms.sort((a, b) => {
      // lastMessageSentAt이 없는 경우 맨 아래로
      if (!a.lastMessageSentAt && !b.lastMessageSentAt) return 0;
      if (!a.lastMessageSentAt) return 1;
      if (!b.lastMessageSentAt) return -1;
      
      // 날짜 비교 (최신순)
      return new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime();
    });
  };

  // 채팅방 목록 로드 함수
  const loadChatRooms = async (profileCompleted?: boolean) => {
    try {
      setIsLoading(true);
      const rooms = await getChatRooms();
      
      // 프로필 완성 여부가 전달된 경우에만 읽음 시간 초기화
      if (profileCompleted !== undefined) {
        initializeReadTimes(rooms || [], profileCompleted);
      }
      
      setChatRooms(sortChatRooms(rooms || []));
    } catch (error) {
      console.error('채팅방 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 (백그라운드에서 미리 로드)
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const member = await getCurrentMember();
        if (member && member.memberId) {
          setCurrentMemberId(member.memberId);
          setIsAuthenticated(true);
          
          // 채팅방 목록을 백그라운드에서 미리 로드 (알림 표시용)
          const rooms = await getChatRooms();
          
          // 프로필 완성 여부에 따라 읽음 시간 초기화
          initializeReadTimes(rooms || [], member.profileCompleted);
          
          setChatRooms(sortChatRooms(rooms || []));
          
          connect();
        }
      } catch (error) {
        console.error('초기화 실패:', error);
        setIsAuthenticated(false);
      }
    };
    
    // 페이지 로드 시 바로 초기화 (모달을 열지 않아도)
    initializeChat();
  }, [connect]);

  // 정리
  useEffect(() => {
    if (!isOpen) {
      disconnect();
    }
  }, [isOpen, disconnect]);

  // 페이지 떠날 때 로그아웃 시간 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentMemberId) {
        setLastLogoutTime(new Date().toISOString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // 컴포넌트 언마운트 시에도 저장
      if (currentMemberId) {
        setLastLogoutTime(new Date().toISOString());
      }
    };
  }, [currentMemberId]);

  // 채팅방 메시지 로드
  const loadChatMessages = useCallback(async (chatRoomId: number) => {
    try {
      setIsLoading(true);
      const messages = await getAllChatMessages(chatRoomId);
      setCurrentMessages(messages || []);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 채팅방 클릭
  const handleChatClick = useCallback(async (chatRoom: ChatRoom) => {
    if (!isAuthenticated) {
      console.error("로그인이 필요합니다.");
      return;
    }

    try {
      setSelectedChat(chatRoom.chatRoomId);
      await loadChatMessages(chatRoom.chatRoomId);

      // 유기견 정보가 있는 경우 소유자 정보 로드
      if (chatRoom.dogInfo?.dogId) {
        await loadDogOwnerInfo(chatRoom.dogInfo.dogId);
      }

      // 마지막 읽은 시간을 현재 시간으로 업데이트
      setLastReadTime(chatRoom.chatRoomId, new Date().toISOString());

      // 읽지 않은 메시지 수 초기화
      setUnreadCounts(prev => ({
        ...prev,
        [chatRoom.chatRoomId]: 0
      }));

      // WebSocket 구독
      const subscription = subscribeToChatRoom(chatRoom.chatRoomId);

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error('채팅방 진입 실패:', error);
    }
  }, [isAuthenticated, loadChatMessages, subscribeToChatRoom]);

  // 메시지 전송
  const handleSendMessage = useCallback(async () => {
    if (!selectedChat || !newMessage.trim() || !currentMemberId) return;

    if (!isConnected()) {
      console.error('WebSocket 연결이 끊어졌습니다.');
      return;
    }

    try {
      const success = sendWebSocketMessage(selectedChat, newMessage.trim());
      if (success) {
        setNewMessage("");
        // 임시 해결책: 메시지 전송 후 메시지 목록 다시 로드
        setTimeout(async () => {
          await loadChatMessages(selectedChat);
        }, 500);
      } else {
        console.error('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('메시지 전송 오류:', error);
    }
  }, [selectedChat, newMessage, currentMemberId, isConnected, sendWebSocketMessage]);

  // 채팅방 나가기
  const handleLeaveChatRoom = useCallback(async () => {
    if (!selectedChat || !currentMemberId) return;

    try {
      await leaveChatRoom(selectedChat);
      console.log('채팅방에서 나갔습니다.');
      handleBackToList();
      await loadChatRooms();
    } catch (error) {
      console.error('채팅방 나가기 실패:', error);
    }
  }, [selectedChat, currentMemberId]);

  // 유기견 정보 로드 (소유자 확인용)
  const loadDogOwnerInfo = async (dogId: number) => {
    if (dogOwnerInfo[dogId]) return; // 이미 로드된 경우 스킵

    try {
      const dogDetail = await getDogById(dogId);
      console.log('로드된 유기견 정보:', dogDetail);
      setDogOwnerInfo(prev => ({
        ...prev,
        [dogId]: dogDetail.member.memberId
      }));
    } catch (error) {
      console.error('유기견 정보 로드 실패:', error);
    }
  };

  // 분양 신청
  const handleAdoptionApply = async (dogId: number) => {
    if (!currentMemberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 본인이 등록한 유기견인지 확인
    if (dogOwnerInfo[dogId] === currentMemberId) {
      alert('본인이 등록한 유기견에는 분양 신청할 수 없습니다.');
      return;
    }

    if (!window.confirm('이 유기견에 대한 분양 신청을 하시겠습니까?')) {
      return;
    }

    try {
      await createDogApply({ dogId });
      alert('분양 신청이 완료되었습니다. 상대방의 승인을 기다려주세요.');
    } catch (error) {
      console.error('분양 신청 실패:', error);
      alert('분양 신청에 실패했습니다. 이미 신청했거나 다른 문제가 발생했을 수 있습니다.');
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setCurrentMessages([]);
  };

  const getSelectedChatRoom = () => {
    return chatRooms.find(room => room.chatRoomId === selectedChat);
  };

  const formatTime = (dateString: string) => {
    try {
      // ISO 8601 형식이나 LocalDateTime 형식 처리
      let date = new Date(dateString);
      
      // Invalid Date 체크
      if (isNaN(date.getTime())) {
        // LocalDateTime 형식 (YYYY-MM-DDTHH:mm:ss) 처리
        if (dateString.includes('T')) {
          date = new Date(dateString + 'Z'); // UTC로 처리
        } else {
          console.error('Invalid date format:', dateString);
          return '시간 정보 없음';
        }
      }
      
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return '시간 정보 없음';
    }
  };

  const formatLastMessageTime = (dateString: string) => {
    try {
      // ISO 8601 형식이나 LocalDateTime 형식 처리
      let date = new Date(dateString);
      
      // Invalid Date 체크
      if (isNaN(date.getTime())) {
        // LocalDateTime 형식 (YYYY-MM-DDTHH:mm:ss) 처리
        if (dateString.includes('T')) {
          date = new Date(dateString + 'Z'); // UTC로 처리
        } else {
          console.error('Invalid date format:', dateString);
          return '';
        }
      }
      
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) {
        return date.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else if (days === 1) {
        return '어제';
      } else if (days < 7) {
        return `${days}일 전`;
      } else {
        return date.toLocaleDateString('ko-KR', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return '';
    }
  };

  // 총 읽지 않은 메시지 수 계산
  const totalUnreadCount = chatRooms.filter(room => hasUnreadMessage(room)).length;

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg relative"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {totalUnreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  const chatContainer = (
    <Card className={`shadow-2xl ${
      isFullscreen 
        ? "fixed inset-0 z-50 rounded-none" 
        : isMobile 
          ? "fixed inset-4 z-50" 
          : "fixed bottom-6 right-6 w-96 h-[600px] z-50"
    }`}>
      <CardContent className="p-0 h-full flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
          <div className="flex items-center space-x-2">
            {selectedChat && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackToList}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h3 className="font-semibold text-lg">
              {selectedChat ? (
                <>
                  {getSelectedChatRoom()?.otherMemberInfo?.nickname || '채팅'}
                  {getSelectedChatRoom()?.dogInfo?.name && (
                    <span className="text-sm font-normal ml-1">
                      ({getSelectedChatRoom()?.dogInfo?.name})
                    </span>
                  )}
                </>
              ) : '채팅'}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            {selectedChat && (
              <>
                {/* 분양 신청 버튼 - dogInfo가 있고 본인이 등록자가 아닌 경우에만 표시 */}
                {(() => {
                  const chatRoom = getSelectedChatRoom();
                  const dogId = chatRoom?.dogInfo?.dogId;
                  const ownerId = dogId ? dogOwnerInfo[dogId] : undefined;

                  // 디버깅용 로그
                  console.log('채팅방 분양 신청 버튼 조건 확인:', {
                    dogId,
                    ownerId,
                    currentMemberId,
                    dogOwnerInfo,
                    chatRoom: chatRoom?.dogInfo
                  });

                  // dogInfo가 있고, 소유자 정보가 로드되었으며, 본인이 소유자가 아닌 경우에만 표시
                  return dogId && ownerId !== undefined && ownerId !== currentMemberId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAdoptionApply(dogId)}
                      className="text-primary-foreground hover:bg-primary-foreground/20 gap-1"
                    >
                      <Heart className="h-4 w-4" />
                      분양 신청
                    </Button>
                  );
                })()}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLeaveChatRoom}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </>
            )}
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setIsOpen(false);
                setSelectedChat(null);
                setCurrentMessages([]);
              }}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden">
          {!selectedChat ? (
            /* 채팅방 목록 */
            <ScrollArea className="h-full">
              <div className="p-2">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-sm text-muted-foreground">로딩 중...</div>
                  </div>
                ) : chatRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      아직 채팅방이 없습니다
                    </p>
                  </div>
                ) : (
                  chatRooms.map((room) => (
                    <div
                      key={room.chatRoomId}
                      onClick={() => handleChatClick(room)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        hasUnreadMessage(room)
                          ? 'bg-primary/5 hover:bg-primary/10' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {room.dogInfo?.name ? '🐕' : (room.otherMemberInfo?.nickname?.charAt(0) || 'U')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${
                            hasUnreadMessage(room)
                              ? 'font-extrabold text-foreground' 
                              : 'font-medium text-foreground'
                          }`}>
                            {room.otherMemberInfo?.nickname || '알 수 없는 사용자'}
                            {room.dogInfo?.name && (
                              <span className="text-xs text-muted-foreground ml-1 font-normal">
                                ({room.dogInfo.name})
                              </span>
                            )}
                          </p>
                          <div className="flex flex-col items-end space-y-1">
                            {room.lastMessageSentAt && (
                              <span className={`text-xs ${
                                hasUnreadMessage(room)
                                  ? 'text-foreground font-semibold' 
                                  : 'text-muted-foreground'
                              }`}>
                                {formatLastMessageTime(room.lastMessageSentAt)}
                              </span>
                            )}
                            {hasUnreadMessage(room) && (
                              <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
                                N
                              </div>
                            )}
                          </div>
                        </div>
                        {room.lastMessageContent && (
                          <p className={`text-sm truncate ${
                            hasUnreadMessage(room)
                              ? 'text-foreground font-semibold' 
                              : 'text-muted-foreground'
                          }`}>
                            {room.lastMessageContent}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          ) : (
            /* 채팅 메시지 */
            <div className="h-full flex flex-col">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {currentMessages.map((message) => (
                    <div
                      key={message.messageId}
                      className={`flex ${
                        message.senderId === currentMemberId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 ${
                          message.senderId === currentMemberId
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.sendAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* 메시지 입력 */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return chatContainer;
};

export default ChatButton;