import { useState } from "react";
import { MessageCircle, X, ArrowLeft, Send, Phone, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockChats = [
  { 
    id: 1, 
    name: "김수진 담당자", 
    lastMessage: "안녕하세요! Buddy에 대해 문의해주셔서 감사합니다.", 
    time: "14:36", 
    unread: 2,
    messages: [
      { id: 1, text: "안녕하세요! Buddy 입양에 관심을 가져주셔서 감사합니다.", sender: "other", time: "14:30" },
      { id: 2, text: "혹시 Buddy에 대해 더 자세히 알고 싶어서 연락드렸어요.", sender: "me", time: "14:32" },
      { id: 3, text: "물론입니다! Buddy는 정말 친근하고 활발한 성격을 가지고 있어요. 아이들과도 잘 어울린답니다.", sender: "other", time: "14:33" },
      { id: 4, text: "그렇군요! 언제 한번 직접 만나볼 수 있을까요?", sender: "me", time: "14:35" },
      { id: 5, text: "네, 언제든지 가능해요. 평일 오후나 주말 언제든 편하신 시간에 방문해주세요!", sender: "other", time: "14:36" }
    ]
  },
  { 
    id: 2, 
    name: "박지민 담당자", 
    lastMessage: "Whiskers 입양 관련해서 궁금한 점이 있으시면...", 
    time: "13:25", 
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
    time: "11:20", 
    unread: 1,
    messages: [
      { id: 1, text: "Charlie에 대해 알고 싶어요.", sender: "me", time: "11:15" },
      { id: 2, text: "Charlie는 매우 활발한 성격이라 충분한 운동이 필요해요.", sender: "other", time: "11:20" },
    ]
  }
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
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage, selectedChat ? `to chat: ${selectedChat}` : "new chat");
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

      {/* 카카오톡 스타일 채팅창 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
          <Card className="w-80 h-[32rem] shadow-2xl border-0 overflow-hidden bg-card p-0">
            {/* 채팅 목록 화면 */}
            {!selectedChat && (
              <>
                {/* 헤더 */}
                <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium">채팅</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* 채팅 목록 */}
                <div className="bg-card">
                  <ScrollArea className="h-[26rem]">
                    {mockChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat.id)}
                        className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b border-border transition-colors"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
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
                </div>
              </>
            )}

            {/* 개별 채팅방 화면 */}
            {selectedChat && currentChat && (
              <>
                {/* 채팅방 헤더 */}
                <div className="bg-primary text-primary-foreground p-3 flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToList}
                    className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {currentChat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{currentChat.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClose}
                      className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 메시지 영역 */}
                <div className="bg-muted flex flex-col h-[26rem]">
                  <ScrollArea className="flex-1 p-3">
                    <div className="space-y-2">
                      {currentChat.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div className="max-w-[75%]">
                            <div
                              className={`rounded-2xl px-3 py-2 text-sm ${
                                message.sender === "me"
                                  ? "bg-primary text-primary-foreground ml-auto"
                                  : "bg-card text-card-foreground"
                              }`}
                            >
                              <p className="break-words">{message.text}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${
                              message.sender === "me" ? "justify-end" : "justify-start"
                            }`}>
                              <span className="text-xs text-muted-foreground">
                                {message.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* 메시지 입력창 */}
                  <div className="bg-card px-3 border-t border-border">
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="메시지를 입력하세요"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 border-input focus:border-primary focus:ring-primary rounded-full px-4 h-9"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        disabled={!newMessage.trim()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 w-9 rounded-full p-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatButton;