import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedPets from "@/components/FeaturedPets";
import AdoptionProcess from "@/components/AdoptionProcess";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [kakaoCode, setKakaoCode] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    console.log('Index - success:', success, 'error:', error);

    // 카카오 콜백 파라미터가 있으면 LoginModal을 열고 URL을 정리
    if (success || error) {
      console.log('Index - LoginModal 열기');
      setIsLoginModalOpen(true);
      if (success) {
        setKakaoCode('success'); // success 파라미터를 코드로 전달
      }
      if (error) {
        toast({
          title: "로그인 취소",
          description: "카카오 로그인이 취소되었습니다.",
        });
      }
      // URL 파라미터 제거
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, setSearchParams]);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    // 페이지 새로고침으로 Navbar의 로그인 상태 업데이트
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div className="py-8">
        <FeaturedPets />
        <AdoptionProcess />
      </div>

      <Footer />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        kakaoCode={kakaoCode}
      />
    </div>
  );
};

export default Index;
