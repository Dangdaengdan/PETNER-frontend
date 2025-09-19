import PetCard from "./PetCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Import pet images
import dog1 from "@/assets/dog1.jpg";
import dog2 from "@/assets/dog2.jpg";
import dog3 from "@/assets/dog3.jpg";
import dog4 from "@/assets/dog4.jpg";
import dog5 from "@/assets/dog5.jpg";
import dog6 from "@/assets/dog6.jpg";

const featuredPets = [
  {
    id: "1",
    name: "똥깨",
    breed: "골든 리트리버",
    age: "2세",
    location: "강릉시유기견보호소",
    image: dog1,
    gender: "수컷" as const,
    size: "대형견" as const,
  },
  {
    id: "2",
    name: "구름이",
    breed: "비숑",
    age: "3세",
    location: "시립동물보호센터",
    image: dog2,
    gender: "암컷" as const,
    size: "중형견" as const,
  },
  {
    id: "3",
    name: "땅콩이",
    breed: "말티즈",
    age: "4세",
    location: "서부구조센터",
    image: dog3,
    gender: "수컷" as const,
    size: "소형견" as const,
  },
  {
    id: "4",
    name: "뽀삐",
    breed: "치와와",
    age: "2세",
    location: "해피포우즈 보호소",
    image: dog4,
    gender: "암컷" as const,
    size: "소형견" as const,
  },
  {
    id: "5",
    name: "산체",
    breed: "장모치와와",
    age: "5세",
    location: "전원구조센터",
    image: dog5,
    gender: "수컷" as const,
    size: "소형견" as const,
  },
  {
    id: "6",
    name: "초코",
    breed: "토이푸들",
    age: "2세",
    location: "메트로 동물보호소",
    image: dog6,
    gender: "수컷" as const,
    size: "중형견" as const,
  },
];

const FeaturedPets = () => {
  return (
    <section className="py-16 bg-gradient-soft">
      <div className="mx-auto px-2 sm:px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            입양을 기다리는 친구들
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            사랑스러운 반려 친구들이 평생의 가족을 찾고 있어요.
            모두가 특별한 성격과 따뜻한 마음을 가지고 있으며, 지금 새로운 시작을 함께할 주인을 기다립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} {...pet} />
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm transition-smooth"
          >
            더 많은 친구들 보기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPets;