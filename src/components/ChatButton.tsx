import { useState } from "react";
import { MessageCircle, X, Users, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockChats = [
  { 
    id: 1, 
    name: "김수진 담당자", 
    lastMessage: "안녕하세요! Buddy에 대해 문의해주셔서 감사합니다.", 
    time: "2분 전", 
    unread: 2,
    messages: [
      { id: 1, text: "안녕하세요! Buddy 입양에 관심을 가져주셔서 감사합니다.", sender: "other", time: "14:30" },
      { id: 2, text: "혹시 Buddy에 대해 더 자세히 알고 싶어서 연락드렸어요.", sender: "me", time: "14:32" },
      { id: 3, text: "물론입니다! Buddy는 정말 친근하고 활발한 성격을 가지고 있어요.", sender: "other", time: "14:33" },
      { id: 4, text: "아이들과도 잘 어울리나요?", sender: "me", time: "14:35" },
      { id: 5, text: "네, 아이들을 정말 좋아해요. 언제 한번 직접 만나보시겠어요?", sender: "other", time: "14:36" }
    ]
  },
  { 
    id: 2, 
    name: "박지민 담당자", 
    lastMessage: "Whiskers 입양 관련해서 궁금한 점이 있으시면...", 
    time: "1시간 전", 
    unread: 0,
    messages: [
      { id: 1, text: "Whiskers에 대해 문의드립니다.", sender: "me", time: "13:20" },
      { id: 2, text: "Whiskers 입양 관련해서 궁금한 점이 있으시면 언제든 말씀해주세요.", sender: "other", time: "13:25" },
    ]
  },
  { 
    id: 3, 
    name: "이동현 담당자", 
    lastMessage: "Charlie는 매우 활발한 성격이라...", 
    time: "3시간 전", 
    unread: 1,
    messages: [
      { id: 1, text: "Charlie에 대해 알고 싶어요.", sender: "me", time: "11:15" },
      { id: 2, text: "Charlie는 매우 활발한 성격이라 충분한 운동이 필요해요.", sender: "other", time: "11:20" },
    ]
  },
  { 
    id: 4, 
    name: "최영희 담당자", 
    lastMessage: "Luna 입양 절차에 대해 안내드리겠습니다.", 
    time: "어제", 
    unread: 0,
    messages: [
      { id: 1, text: "Luna 입양 절차가 어떻게 되나요?", sender: "me", time: "어제 16:30" },
      { id: 2, text: "Luna 입양 절차에 대해 안내드리겠습니다.", sender: "other", time: "어제 16:35" },
    ]
  },
];

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const handleChatClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedChat(null);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // 실제로는 여기서 서버로 메시지를 전송하고 상태를 업데이트
      console.log("Sending message:", newMessage, "to chat:", selectedChat);
      setNewMessage("");
    } else if (newMessage.trim() && !selectedChat) {
      // 새로운 채팅 시작
      console.log("Starting new chat with message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const currentChat = selectedChat ? mockChats.find(chat => chat.id === selectedChat) : null;

  return (
    <>
      {/* 채팅 버튼 */}
      {!isOpen && (
        <Button
          onClick={handleChatClick}
          size="lg"
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-fade-in"
        >
          <MessageCircle className="h-8 w-8" />
          <span className="sr-only">채팅하기</span>
        </Button>
      )}

      {/* 채팅 팝업 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
          <Card className="w-96 h-[32rem] shadow-xl border-2">
            {/* 채팅 목록 헤더 */}
            {!selectedChat && (
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    채팅 목록
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            )}

            {/* 개별 채팅방 헤더 */}
            {selectedChat && currentChat && (
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToList}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-base">{currentChat.name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            )}

            <CardContent className="p-0 flex flex-col h-full">
              {/* 채팅 목록 */}
              {!selectedChat && (
                <>
                  <ScrollArea className="flex-1">
                    {mockChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat.id)}
                        className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b border-border transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {chat.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-foreground truncate">
                              {chat.name}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {chat.time}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground truncate">
                              {chat.lastMessage}
                            </p>
                            {chat.unread > 0 && (
                              <span className="bg-accent text-accent-foreground text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  
                  {/* 새 채팅 시작 입력창 */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="새로운 채팅을 시작하세요..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="px-3"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* 개별 채팅방 */}
              {selectedChat && currentChat && (
                <>
                  {/* 메시지 목록 */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {currentChat.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              message.sender === "me"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p>{message.text}</p>
                            <span className={`text-xs mt-1 block ${
                              message.sender === "me" 
                                ? "text-primary-foreground/70" 
                                : "text-muted-foreground"
                            }`}>
                              {message.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* 메시지 입력 */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="메시지를 입력하세요..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="px-3"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatButton;