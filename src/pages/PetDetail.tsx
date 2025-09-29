import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowLeft, Heart, MessageCircle, MapPin, Calendar, Users } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDogById, DogDetailResponseDto } from "@/api/dog";
import { isFavorite } from "@/api/favorite";
import { calculateAge } from "@/utils/ageCalculator";
import { ProtectedImage } from "@/components/ProtectedImage";
import { createChatRoom } from "@/api/chat";
import { getCurrentMember } from "@/api/auth";
import { useFavorite } from "@/hooks/useFavorite";
import { useToast } from "@/hooks/use-toast";
import LoginModal from "@/components/LoginModal";
import { createDogApply } from "@/api/dogapply";


const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [dog, setDog] = useState<DogDetailResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialIsFavorite, setInitialIsFavorite] = useState<boolean | undefined>(undefined);

  // 관심 목록 훅 (dog가 로드된 후에만 사용)
  const { isFavorited, isLoading: favoriteLoading, toggleFavorite } = useFavorite(
    dog?.dogId || 0,
    initialIsFavorite,
    () => setShowLoginModal(true) // 로그인이 필요할 때 모달 표시
  );
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const loadDogDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // 강아지 정보와 즐겨찾기 상태 병렬 호출
        const [dogData, favoriteStatus] = await Promise.all([
          getDogById(Number(id)),
          isFavorite(Number(id)).catch(() => false) // 에러 시 false 반환
        ]);

        setDog(dogData);
        setInitialIsFavorite(favoriteStatus);
      } catch (error) {
        console.error("유기견 상세 정보 로드 실패:", error);
        setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadDogDetail();
  }, [id]);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const loadCurrentMember = async () => {
      try {
        const member = await getCurrentMember();
        setCurrentMemberId(member.memberId);
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };

    loadCurrentMember();
  }, []);

  // 분양 신청
  const handleAdoptionApply = async () => {
    if (!dog || !currentMemberId) {
      toast({
        title: "로그인 필요",
        description: "분양 신청을 하려면 로그인이 필요합니다.",
      });
      return;
    }

    // 본인이 등록한 유기견인지 확인
    if (dog.member.memberId === currentMemberId) {
      toast({
        title: "분양 신청 불가",
        description: "본인이 등록한 유기견에는 분양 신청을 할 수 없습니다.",
      });
      return;
    }

    // 입양 가능 상태가 아닌 경우 체크
    if (dog.adoptionStatus !== "입양_가능") {
      toast({
        title: "분양 신청 불가",
        description: "현재 입양 가능한 상태가 아닙니다.",
      });
      return;
    }

    // 분양 신청 확인
    if (!window.confirm(`${dog.name}에 대한 분양 신청을 하시겠습니까?`)) {
      return;
    }

    try {
      setApplyLoading(true);

      // 분양 신청 API 호출
      await createDogApply({ dogId: dog.dogId });

      toast({
        title: "분양 신청 완료",
        description: "분양 신청이 완료되었습니다. 등록자의 승인을 기다려주세요.",
      });

    } catch (error) {
      console.error('분양 신청 실패:', error);
      toast({
        title: "분양 신청 실패",
        description: "분양 신청에 실패했습니다. 이미 신청했거나 다른 문제가 발생했을 수 있습니다.",
      });
    } finally {
      setApplyLoading(false);
    }
  };

  // 채팅방 생성 또는 이동
  const handleStartChat = async () => {
    if (!dog || !currentMemberId) {
      toast({
        title: "로그인 필요",
        description: "채팅을 시작하려면 로그인이 필요합니다.",
      });
      return;
    }

    // 본인이 등록한 유기견인지 확인
    if (dog.member.memberId === currentMemberId) {
      toast({
        title: "채팅 불가",
        description: "본인이 등록한 유기견에는 채팅을 할 수 없습니다.",
      });
      return;
    }

    // 채팅 시작 확인
    if (!window.confirm(`${dog.member.nickname}님과 ${dog.name}에 대해 채팅을 시작하시겠습니까?`)) {
      return;
    }

    try {
      setChatLoading(true);

      // 채팅방 생성 (이미 있으면 기존 채팅방 반환)
      const chatRoomResponse = await createChatRoom({
        otherMemberId: dog.member.memberId,
        dogId: dog.dogId
      });

      console.log('채팅방 생성/조회 성공:', chatRoomResponse);

      // 채팅방으로 바로 이동
      // window 이벤트를 통해 ChatButton에 신호 전송
      window.dispatchEvent(new CustomEvent('openChatRoom', {
        detail: { chatRoomId: chatRoomResponse.chatRoomId }
      }));

    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      toast({
        title: "채팅방 생성 실패",
        description: "채팅방 생성에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg text-muted-foreground">로딩 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "강아지를 찾을 수 없습니다"}
            </h1>
            <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8 flex-1">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => {
            const from = searchParams.get('from');
            const tab = searchParams.get('tab');

            if (from === 'profile' && tab) {
              navigate(`/profile?tab=${tab}`);
            } else {
              navigate(-1);
            }
          }}
          className="mb-6 text-brown-700 hover:text-brown-900 px-4 py-3 text-base"
        >
          <ArrowLeft className="h-5 w-5 mr-2" strokeWidth={3} />
          돌아가기
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Pet Image Carousel */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <Card className="overflow-hidden h-fit rounded-2xl">
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    <CarouselItem>
                      <div className="relative">
                        {dog.imageUrl ? (
                          <ProtectedImage
                            objectName={dog.imageUrl}
                            alt={`${dog.name} - ${dog.breed.name}`}
                            className="w-full h-64 lg:h-80 object-cover"
                          />
                        ) : (
                          <div className="w-full h-64 lg:h-80 bg-gray-200 flex items-center justify-center text-gray-500">
                            이미지 없음
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </Carousel>
                <button
                  onClick={toggleFavorite}
                  disabled={favoriteLoading || !dog?.dogId}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-sm transition-smooth hover:bg-background z-10 disabled:opacity-50"
                >
                  <Heart
                    className={`h-5 w-5 transition-smooth ${
                      isFavorited
                        ? "text-red-500 fill-current"
                        : "text-muted-foreground hover:text-red-400"
                    }`}
                  />
                </button>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {/* 분양 신청 버튼 */}
              <Button
                size="lg"
                className={`w-full text-lg py-4 rounded-full ${
                  (dog && dog.member.memberId === currentMemberId)
                    ? "bg-green-500 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-700 text-white"
                }`}
                onClick={handleAdoptionApply}
                disabled={
                  applyLoading ||
                  !currentMemberId ||
                  (dog && dog.member.memberId === currentMemberId) ||
                  (dog && dog.adoptionStatus !== "입양_가능")
                }
              >
                <Heart className="h-6 w-6 mr-2" />
                {applyLoading ? '분양 신청 중...' :
                 (dog && dog.member.memberId === currentMemberId) ? '본인 등록 유기견' :
                 (dog && dog.adoptionStatus !== "입양_가능") ? `입양 불가 (${dog.adoptionStatus.replace('_', ' ')})` :
                 '분양 신청'}
              </Button>

              {/* 채팅 버튼 */}
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-4 rounded-full"
                onClick={handleStartChat}
                disabled={chatLoading || !currentMemberId || (dog && dog.member.memberId === currentMemberId)}
              >
                <MessageCircle className="h-6 w-6 mr-2" />
                {chatLoading ? '채팅방 생성 중...' :
                 (dog && dog.member.memberId === currentMemberId) ? '본인 등록 유기견' : '채팅 하기'}
              </Button>
            </div>

            {/* Buddy Information */}
            <div className="mt-6 flex-1">
              <Card className="h-full rounded-2xl">
                <CardContent className="p-10 h-full flex flex-col justify-center">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-foreground mb-2 whitespace-nowrap truncate">{dog.name}</h1>
                    <p className="text-xl text-muted-foreground mb-4 whitespace-nowrap truncate">{dog.breed.name}</p>

                    <div className="flex gap-2 mb-4 whitespace-nowrap overflow-hidden">
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-sm px-3 py-1">
                        {dog.gender === 'MALE' ? '수컷' : '암컷'}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-300 text-brown-800 text-sm px-3 py-1">
                        {dog.dogSize}
                      </Badge>
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-sm px-3 py-1">
                        {calculateAge(dog.birthDate)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-muted-foreground whitespace-nowrap overflow-hidden">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm truncate">{calculateAge(dog.birthDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm truncate">{dog.shelter?.name || "보호소 정보 없음"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Care Information Cards - Horizontal Layout */}
          <div className="lg:col-span-3 space-y-8 flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">의료 정보</h3>
                  <p className="text-sm text-muted-foreground">{dog.healthStatus}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">담당자 정보</h3>
                  <p className="text-sm text-muted-foreground">{dog.member.nickname}</p>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="flex-1 rounded-2xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">기타 설명</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {dog.description}
                </p>
              </CardContent>
            </Card>

            {/* Additional Information for larger screens */}
            <div className="hidden lg:block">
              <Card className="flex-1 rounded-2xl">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">입양 과정</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base font-semibold">1</span>
                      <span className="text-base">입양 신청서 작성</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base font-semibold">2</span>
                      <span className="text-base">담당자와 상담 및 만남 예약</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base font-semibold">3</span>
                      <span className="text-base">펫과 만남 및 호환성 확인</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base font-semibold">4</span>
                      <span className="text-base">입양 완료 및 새 가족 되기</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      

      <div className="mt-12">
        <Footer />
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          // 로그인 후 찜 상태를 다시 확인할 수 있도록 페이지 새로고침
          window.location.reload();
        }}
      />
    </div>
  );
};

export default PetDetail;