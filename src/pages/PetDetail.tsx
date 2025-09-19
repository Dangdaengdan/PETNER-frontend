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
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import pet images
import dog1 from "@/assets/dog1.jpg";
import dog2 from "@/assets/dog2.jpg";
import dog3 from "@/assets/dog3.jpg";
import dog4 from "@/assets/dog4.jpg";
import dog5 from "@/assets/dog5.jpg";
import dog6 from "@/assets/dog6.jpg";

const petsData = {
  "1": {
    id: "1",
    name: "Buddy",
    breed: "Golden Retriever",
    age: "2 years",
    location: "Downtown Shelter",
    images: [dog1, dog1, dog1],
    gender: "Male" as const,
    size: "Large" as const,
    description: "Buddy는 매우 친근하고 활발한 골든 리트리버입니다. 아이들과 잘 어울리며, 매일 산책을 좋아합니다. 기본적인 훈련이 되어 있어 가족과 함께 생활하기에 완벽한 반려견입니다.",
    personality: ["친근함", "활발함", "충성심", "사교적"],
    medicalInfo: "모든 예방접종 완료, 중성화 수술 완료",
    caretakerInfo: "Downtown Shelter - 김수진 담당자"
  },
  "2": {
    id: "2", 
    name: "Whiskers",
    breed: "Tabby Cat",
    age: "3 years",
    location: "City Animal Center",
    images: [dog2,dog2,dog2],
    gender: "Female" as const,
    size: "Medium" as const,
    description: "Whiskers는 조용하고 우아한 태비 고양이입니다. 조용한 환경을 좋아하며, 무릎에 앉아 있는 것을 즐깁니다. 독립적이지만 애정이 많은 성격을 가지고 있습니다.",
    personality: ["조용함", "우아함", "독립적", "애정적"],
    medicalInfo: "모든 예방접종 완료, 중성화 수술 완료",
    caretakerInfo: "City Animal Center - 박지민 담당자"
  },
  "3": {
    id: "3",
    name: "Charlie",
    breed: "Beagle",
    age: "4 years",
    location: "Westside Rescue",
    images: [dog3, dog3, dog3],
    gender: "Male" as const,
    size: "Medium" as const,
    description: "Charlie는 호기심이 많고 에너지가 넘치는 비글입니다. 냄새 맡기를 좋아하며, 다른 개들과도 잘 어울립니다. 가족들과 함께 놀기를 좋아하는 활발한 성격입니다.",
    personality: ["호기심", "활발함", "사교적", "장난기"],
    medicalInfo: "모든 예방접종 완료, 중성화 수술 완료",
    caretakerInfo: "Westside Rescue - 이동현 담당자"
  },
  "4": {
    id: "4",
    name: "Luna",
    breed: "Persian Cat",
    age: "1 year",
    location: "Happy Paws Shelter",
    images: [dog4,dog4,dog4],
    gender: "Female" as const,
    size: "Small" as const,
    description: "Luna는 아름답고 온화한 페르시안 고양이입니다. 조용한 성격이지만 주인에게는 매우 애정적입니다. 털이 길어 정기적인 빗질이 필요하지만, 그만큼 아름다운 모습을 자랑합니다.",
    personality: ["온화함", "아름다움", "조용함", "애정적"],
    medicalInfo: "모든 예방접종 완료, 중성화 수술 예정",
    caretakerInfo: "Happy Paws Shelter - 최영희 담당자"
  },
  "5": {
    id: "5",
    name: "Max",
    breed: "Border Collie",
    age: "5 years",
    location: "Countryside Rescue",
    images: [dog5, dog5, dog5],
    gender: "Male" as const,
    size: "Large" as const,
    description: "Max는 매우 똑똑하고 충성스러운 보더 콜리입니다. 훈련을 받는 것을 좋아하며, 활동적인 가족에게 완벽한 반려견입니다. 매일 충분한 운동과 정신적 자극이 필요합니다.",
    personality: ["똑똑함", "충성심", "활발함", "훈련성"],
    medicalInfo: "모든 예방접종 완료, 중성화 수술 완료",
    caretakerInfo: "Countryside Rescue - 조민수 담당자"
  },
  "6": {
    id: "6",
    name: "Shadow",
    breed: "Domestic Shorthair",
    age: "2 years", 
    location: "Metro Animal Shelter",
    images: [dog6,dog6],
    gender: "Male" as const,
    size: "Medium" as const,
    description: "Shadow는 신비로운 매력을 가진 검은 고양이입니다. 처음에는 조금 수줍어하지만, 친해지면 매우 애정적이고 장난기 많은 성격을 보입니다. 조용한 환경에서 편안함을 느낍니다.",
    personality: ["신비로움", "수줍음", "애정적", "장난기"],
    medicalInfo: "모든 예방접종 완료, 중성화 수술 완료",
    caretakerInfo: "Metro Animal Shelter - 김태영 담당자"
  }
};

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  
  const pet = id ? petsData[id as keyof typeof petsData] : null;

  if (!pet) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Pet not found</h1>
            <Button onClick={() => navigate('/')}>Go back home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto px-2 sm:px-4 lg:px-6 py-2">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Pet Image Carousel */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden h-fit">
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {pet.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative">
                          <img
                            src={image}
                            alt={`${pet.name} - ${pet.breed} ${index + 1}`}
                            className="w-full h-64 lg:h-80 object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
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
            <div className="flex gap-2 mt-3">
              <Button 
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                채팅 하기
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setIsFavorited(!isFavorited)}
                className={`border-2 transition-smooth ${
                  isFavorited 
                    ? "border-accent text-accent bg-accent/10" 
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Care Information Cards */}
            <div className="space-y-3 mt-3">
              <Card>
                <CardContent className="p-3">
                  <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    성격적 정보
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {pet.personality.map((trait, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <h3 className="text-base font-semibold text-foreground mb-2">의료 정보</h3>
                  <p className="text-xs text-muted-foreground">{pet.medicalInfo}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <h3 className="text-base font-semibold text-foreground mb-2">담당자 정보</h3>
                  <p className="text-xs text-muted-foreground">{pet.caretakerInfo}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pet Information */}
          <div className="lg:col-span-2 space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h1 className="text-2xl font-bold text-foreground mb-1">{pet.name}</h1>
                  <p className="text-lg text-muted-foreground mb-3">{pet.breed}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {pet.gender}
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      {pet.size}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      {pet.age}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{pet.age}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{pet.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">기타 설명</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {pet.description}
                </p>
              </CardContent>
            </Card>

            {/* Additional Information for larger screens */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-3">입양 과정</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                      <span className="text-sm">온라인 신청서 작성</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                      <span className="text-sm">담당자와 상담 및 만남 예약</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                      <span className="text-sm">펫과 만남 및 호환성 확인</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                      <span className="text-sm">입양 완료 및 새 가족 되기</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-3">입양 준비사항</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">필수 준비물</h4>
                      <ul className="space-y-1">
                        <li>• 급식그릇 및 물그릇</li>
                        <li>• 침대 또는 쿠션</li>
                        <li>• 목줄 및 리드줄</li>
                        <li>• 장난감</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">환경 준비</h4>
                      <ul className="space-y-1">
                        <li>• 안전한 실내 공간 확보</li>
                        <li>• 위험물질 제거</li>
                        <li>• 적절한 온도 유지</li>
                        <li>• 정기적인 운동 계획</li>
                      </ul>
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