import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatButton = () => {
  const handleChatClick = () => {
    // 채팅 기능 구현 예정
    console.log("Chat button clicked");
  };

  return (
    <Button
      onClick={handleChatClick}
      size="lg"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">채팅하기</span>
    </Button>
  );
};

export default ChatButton;