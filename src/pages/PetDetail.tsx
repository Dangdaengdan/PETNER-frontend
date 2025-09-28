import { useParams, useNavigate } from "react-router-dom";
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
import { calculateAge } from "@/utils/ageCalculator";
import { ProtectedImage } from "@/components/ProtectedImage";


const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [dog, setDog] = useState<DogDetailResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDogDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const dogData = await getDogById(Number(id));
        setDog(dogData);
      } catch (error) {
        console.error("유기견 상세 정보 로드 실패:", error);
        setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadDogDetail();
  }, [id]);

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Pet Image Carousel */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <Card className="overflow-hidden h-fit">
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
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-sm transition-smooth hover:bg-background z-10"
                >
                  <Heart
                    className={`h-5 w-5 transition-smooth ${
                      isFavorited 
                        ? "text-accent fill-current" 
                        : "text-muted-foreground hover:text-accent"
                    }`}
                  />
                </button>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="mt-6">
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-4"
              >
                <MessageCircle className="h-6 w-6 mr-2" />
                채팅 하기
              </Button>
            </div>

            {/* Buddy Information */}
            <div className="mt-6 flex-1">
              <Card className="h-full">
                <CardContent className="p-6 h-full flex flex-col justify-center">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{dog.name}</h1>
                    <p className="text-xl text-muted-foreground mb-4">{dog.breed.name}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-sm px-3 py-1">
                        {dog.gender === 'MALE' ? '수컷' : '암컷'}
                      </Badge>
                      <Badge variant="secondary" className="bg-accent/10 text-accent text-sm px-3 py-1">
                        {dog.dogSize}
                      </Badge>
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-sm px-3 py-1">
                        {calculateAge(dog.birthDate)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{calculateAge(dog.birthDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{dog.shelter?.name || "보호소 정보 없음"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Care Information Cards - Horizontal Layout */}
          <div className="lg:col-span-3 space-y-6 flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">의료 정보</h3>
                  <p className="text-sm text-muted-foreground">{dog.healthStatus}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">담당자 정보</h3>
                  <p className="text-sm text-muted-foreground">{dog.member.nickname}</p>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="flex-1">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">기타 설명</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {dog.description}
                </p>
              </CardContent>
            </Card>

            {/* Additional Information for larger screens */}
            <div className="hidden lg:block">
              <Card className="flex-1">
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

      <Footer />
    </div>
  );
};

export default PetDetail;