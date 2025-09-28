import PetCard from "./PetCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import RegionSelector from "./RegionSelector";
import { ProtectedImage } from "./ProtectedImage";
import { getDogs, DogListResponseDto } from "@/api/dog";
import { calculateAge } from "@/utils/ageCalculator";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
type BRFilterState = { dogSize: string; dogBreed: string; location: string };
import { useNavigate } from "react-router-dom";

// FeaturedPetCard component with ProtectedImage
interface FeaturedPetCardProps {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  location: string;
  imageUrl: string;
  gender: string;
  size: string;
}

const FeaturedPetCard = ({ id, name, breed, birthDate, location, imageUrl, gender, size }: FeaturedPetCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className="group overflow-hidden bg-card border-border rounded-3xl shadow-petcard w-full transition-transform duration-300 hover:-translate-y-2 p-8">
      <div className="relative overflow-hidden rounded-2xl">
        <AspectRatio ratio={16 / 9}>
          {imageUrl ? (
            <ProtectedImage
              objectName={imageUrl}
              alt={`${name} - ${breed}`}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              이미지 없음
            </div>
          )}
        </AspectRatio>
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 p-3 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorited
                ? "text-accent fill-current"
                : "text-muted-foreground"
            }`}
          />
        </button>

        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {gender}
          </Badge>
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {size}
          </Badge>
        </div>
      </div>

      <CardContent className="p-0 pt-8">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {name}
            </h3>
            <p className="text-muted-foreground">{breed}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{calculateAge(birthDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              asChild
              className="flex-1 bg-[#A3966A] hover:bg-[#895D2B] text-white rounded-full transition-colors"
            >
              <Link to={`/pet/${id}`}>
                Meet {name}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


const FeaturedPets = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<BRFilterState>({ dogSize: "", dogBreed: "", location: ""});
  const [searchTerm, setSearchTerm] = useState("");
  const [regionProvince, setRegionProvince] = useState("");
  const [regionCity, setRegionCity] = useState("");

  // API state
  const [featuredDogs, setFeaturedDogs] = useState<DogListResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Load featured dogs on component mount
  useEffect(() => {
    const loadFeaturedDogs = async () => {
      try {
        setLoading(true);
        // 최신 6마리 가져오기 (첫 번째 페이지에서 6개)
        const data = await getDogs(0, 6);
        setFeaturedDogs(data);
      } catch (error) {
        console.error("추천 유기견 로드 실패:", error);
        setFeaturedDogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedDogs();
  }, []);

  const dogBreedsBySize = {
    '소형견': [
      '토이 푸들', '말티즈', '요크셔테리어', '포메라니안', '치와와', '시츄',
      '잭 러셀 테리어', '보스턴 테리어', '카발리에 킹 찰스 스파니엘',
      '이탈리안 그레이하운드', '미니어처 슈나우저', '핀셔', '미니어처 핀셔',
      '위펫', '휘펫', '혼합견', '기타'
    ],
    '중형견': [
      '보더 콜리', '푸들', '비글', '불독', '웰시코기', '진돗개', '풍산개',
      '삽살개', '코카스파니엘', '바셋 하운드', '브리타니 스파니엘',
      '시베리안 허스키', '슈나우저', '불 테리어', '스태퍼드셔 불 테리어',
      '아메리칸 스태퍼드셔 테리어', '핏불 테리어', '바이센지', '세터',
      '포인터', '혼합견', '기타'
    ],
    '대형견': [
      '골든 리트리버', '래브라도 리트리버', '저먼 셰퍼드', '로트와일러',
      '도베르만', '도베르만 핀셔', '사모예드', '아키타', '복서', '그레이트 데인',
      '세인트 버나드', '마스티프', '차우차우', '알래스칸 말라뮤트', '달마시안',
      '와이마라너', '비즐라', '아프간 하운드', '그레이하운드', '자이언트 슈나우저',
      '로디지안 리지백', '파라오 하운드', '이비자 하운드', '살루키', '보르조이',
      '아이리시 울프하운드', '스코티시 디어하운드', '혼합견', '기타'
    ]
  } as const;

  const handleFilterChange = (key: keyof BRFilterState, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'dogSize') next.dogBreed = "";
      return next;
    });
  };
  
  // Add age and gender filters consistent with Register UI
  const [age, setAge] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [gender, setGender] = useState("");
  return (
    <section className="py-16 bg-gradient-soft">
      <div className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48">
        <div className="text-center mb-12">
          <h2 className="section-heading">
            입양을 기다리는 친구들
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            사랑스러운 반려 친구들이 평생의 가족을 찾고 있어요.
            모두가 특별한 성격과 따뜻한 마음을 가지고 있으며, 지금 새로운 시작을 함께할 주인을 기다립니다.
          </p>
        </div>

        {/* Airbnb-like pill search bar with inline toggles */}
        <div className="mb-12">
          <div className="w-full max-w-3xl mx-auto rounded-full bg-background border border-border shadow-warm px-2 py-2">
            <div className="flex items-center">
              <div className="grid grid-cols-6 gap-0 flex-1 px-3 py-2">
                {/* Search (col-span-2) */}
                <div className="col-span-2 flex items-center h-12 px-4">
                  <Search className="h-5 w-5 text-muted-foreground mr-3" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="이름, 특징 등 검색"
                    className="h-10 bg-transparent border-0 focus-visible:ring-0 px-0"
                  />
                </div>
                {/* Breed (col-span-1) */}
                <div className="col-span-1 flex items-center h-12 px-4 border-l border-border">
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 text-left w-full">
                      <span className="text-sm text-muted-foreground">견종</span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {filters.dogBreed || filters.dogSize || "선택"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">견종 크기</label>
                          <Select value={filters.dogSize} onValueChange={(v) => handleFilterChange('dogSize', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="선택하기" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="소형견">소형</SelectItem>
                              <SelectItem value="중형견">중형</SelectItem>
                              <SelectItem value="대형견">대형</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">견종</label>
                          <Select value={filters.dogBreed} onValueChange={(v) => handleFilterChange('dogBreed', v)} disabled={!filters.dogSize}>
                            <SelectTrigger>
                              <SelectValue placeholder={filters.dogSize ? "견종 선택" : "먼저 크기를 선택하세요"} />
                            </SelectTrigger>
                            <SelectContent>
                              {filters.dogSize && dogBreedsBySize[filters.dogSize as keyof typeof dogBreedsBySize]?.map((breed) => (
                                <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Age (col-span-1) */}
                <div className="col-span-1 flex items-center h-12 px-4 border-l border-border">
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 text-left w-full">
                      <span className="text-sm text-muted-foreground">나이</span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {age ? (age === "0" && ageMonths ? `${age}세 ${ageMonths}개월` : `${age}세`) : "선택"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">세</label>
                            <Input
                              type="number"
                              min="0"
                              placeholder="예: 2"
                              value={age}
                              onChange={(e) => {
                                const v = e.target.value;
                                setAge(v);
                                if (v !== "0" && v !== "") setAgeMonths("");
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">개월 (0세)</label>
                            <Input
                              type="number"
                              min="1"
                              max="11"
                              placeholder="0세일 때만"
                              value={ageMonths}
                              onChange={(e) => setAgeMonths(e.target.value)}
                              disabled={age !== "0"}
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Gender (col-span-1) */}
                <div className="col-span-1 flex items-center h-12 px-4 border-l border-border">
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 text-left w-full">
                      <span className="text-sm text-muted-foreground">성별</span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {gender === "male" ? "수컷" : gender === "female" ? "암컷" : "선택"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-60" align="start">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">성별</label>
                        <Select value={gender} onValueChange={(v) => setGender(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="선택하기" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">수컷</SelectItem>
                            <SelectItem value="female">암컷</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Region (col-span-1) */}
                <div className="col-span-1 flex items-center h-12 px-4 border-l border-border">
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 text-left w-full">
                      <span className="text-sm text-muted-foreground">지역</span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {filters.location || "선택"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-[420px]" align="start">
                      <RegionSelector 
                        initialProvince={regionProvince}
                        initialCity={regionCity}
                        showSelectedBox={false}
                        onRegionChange={(province, city) => {
                          setRegionProvince(province);
                          setRegionCity(city);
                          setFilters((prev) => ({ ...prev, location: city ? `${province} ${city}` : province }));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <button
                className="ml-2 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-smooth"
                onClick={() => navigate(searchTerm ? `/pets?q=${encodeURIComponent(searchTerm)}` : "/pets")}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-14 mb-16">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-8 border rounded-3xl animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-2xl mb-6"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredDogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">등록된 유기견이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-14 mb-16">
            {featuredDogs.map((dog) => (
              <div key={dog.dogId} className="p-0">
                <FeaturedPetCard
                  id={dog.dogId.toString()}
                  name={dog.name}
                  breed={dog.breedName}
                  birthDate={dog.birthDate}
                  location={dog.shelterName || "보호소 정보 없음"}
                  imageUrl={dog.imageUrl}
                  gender={dog.gender === 'MALE' ? '수컷' : '암컷'}
                  size={dog.dogSize}
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-[#453021] text-primary-foreground shadow-warm transition-smooth rounded-3xl text-lg px-8 py-4 h-auto group"
            onClick={() => navigate("/pets")}
          >
            더 많은 친구들 보기
            <span className="ml-2 group-hover:hidden">→</span>
            <span className="ml-2 hidden group-hover:inline">🐾🐾</span>
          </Button>
        </div>
      </div>
      {/* Inline toggles replace modal; no modal component needed */}
    </section>
  );
};

export default FeaturedPets;