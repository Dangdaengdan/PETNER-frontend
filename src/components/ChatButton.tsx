import { useState } from "react";
import { MessageCircle, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockChats = [
  { id: 1, name: "김수진 담당자", lastMessage: "안녕하세요! Buddy에 대해 문의해주셔서 감사합니다.", time: "2분 전", unread: 2 },
  { id: 2, name: "박지민 담당자", lastMessage: "Whiskers 입양 관련해서 궁금한 점이 있으시면...", time: "1시간 전", unread: 0 },
  { id: 3, name: "이동현 담당자", lastMessage: "Charlie는 매우 활발한 성격이라...", time: "3시간 전", unread: 1 },
  { id: 4, name: "최영희 담당자", lastMessage: "Luna 입양 절차에 대해 안내드리겠습니다.", time: "어제", unread: 0 },
];

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChatClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChatSelect = (chatId: number) => {
    console.log("Selected chat:", chatId);
    // 개별 채팅방으로 이동하는 로직 추가 예정
  };

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

      {/* 채팅 목록 팝업 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
          <Card className="w-80 h-96 shadow-xl border-2">
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
            <CardContent className="p-0 h-full overflow-hidden">
              <div className="h-full overflow-y-auto">
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatButton;