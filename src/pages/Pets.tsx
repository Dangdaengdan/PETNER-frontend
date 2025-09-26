import { useMemo, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PetCard from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, Calendar } from "lucide-react";
import RegionSelector from "@/components/RegionSelector";

// Images
import dog1 from "@/assets/dog1.jpg";
import dog2 from "@/assets/dog2.jpg";
import dog3 from "@/assets/dog3.jpg";
import dog4 from "@/assets/dog4.jpg";
import dog5 from "@/assets/dog5.jpg";
import dog6 from "@/assets/dog6.jpg";

type Pet = {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  gender: "수컷" | "암컷";
  size: "소형" | "중형" | "대형";
};

const allPets: Pet[] = [
  { id: "1", name: "똥깨", breed: "골든 리트리버", age: "2세", location: "강릉시유기견보호소", image: dog1, gender: "수컷", size: "대형" },
  { id: "2", name: "구름이", breed: "비숑", age: "3세", location: "시립동물보호센터", image: dog2, gender: "암컷", size: "중형" },
  { id: "3", name: "땅콩이", breed: "말티즈", age: "4세", location: "서부구조센터", image: dog3, gender: "수컷", size: "소형" },
  { id: "4", name: "뽀삐", breed: "치와와", age: "2세", location: "해피포우즈 보호소", image: dog4, gender: "암컷", size: "소형" },
  { id: "5", name: "산체", breed: "장모치와와", age: "5세", location: "전원구조센터", image: dog5, gender: "수컷", size: "소형" },
  { id: "6", name: "초코", breed: "토이푸들", age: "2세", location: "메트로 동물보호소", image: dog6, gender: "수컷", size: "중형" },
  // duplicate to have 3 pages worth of items
  { id: "7", name: "해피", breed: "치와와", age: "1세", location: "행복보호소", image: dog4, gender: "암컷", size: "소형" },
  { id: "8", name: "모카", breed: "토이푸들", age: "3세", location: "위드시터", image: dog6, gender: "수컷", size: "중형" },
  { id: "9", name: "보리", breed: "비숑", age: "2세", location: "서초보호소", image: dog2, gender: "암컷", size: "중형" },
  { id: "10", name: "루비", breed: "말티즈", age: "2세", location: "강남보호소", image: dog3, gender: "암컷", size: "소형" },
  { id: "11", name: "쿠키", breed: "골든 리트리버", age: "4세", location: "종합보호센터", image: dog1, gender: "수컷", size: "대형" },
  { id: "12", name: "라떼", breed: "장모치와와", age: "5세", location: "하남보호소", image: dog5, gender: "수컷", size: "소형" },
  { id: "13", name: "두부", breed: "비숑", age: "1세", location: "용인보호소", image: dog2, gender: "암컷", size: "중형" },
  { id: "14", name: "제니", breed: "치와와", age: "2세", location: "분당보호소", image: dog4, gender: "암컷", size: "소형" },
  { id: "15", name: "밤비", breed: "말티즈", age: "3세", location: "일산보호소", image: dog3, gender: "수컷", size: "소형" },
];

const ITEMS_PER_PAGE = 6;

const Pets = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = Math.max(1, Number(params.get("page") || 1));
  const [query, setQuery] = useState<string>(params.get("q") || "");
  
  // Filter states (same as Home)
  const [filters, setFilters] = useState({ dogSize: "", dogBreed: "", location: "" });
  const [regionProvince, setRegionProvince] = useState("");
  const [regionCity, setRegionCity] = useState("");
  const [age, setAge] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [gender, setGender] = useState("");

  // Dog breed data (same as Home)
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

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'dogSize') next.dogBreed = "";
      return next;
    });
  };

  // keep URL in sync when query changes
  useEffect(() => {
    const q = query ? `&q=${encodeURIComponent(query)}` : "";
    navigate(`/pets?page=${currentPage}${q}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filtered = useMemo(() => {
    if (!query) return allPets;
    const q = query.trim().toLowerCase();
    return allPets.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.breed.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [safePage, filtered]);

  const goToPage = (page: number) => {
    const q = query ? `&q=${encodeURIComponent(query)}` : "";
    navigate(`/pets?page=${page}${q}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
        {/* Airbnb-like pill search bar (same as Home) */}
        <div className="mb-10 md:mb-12">
          <div className="w-full max-w-5xl mx-auto rounded-full bg-background border border-border shadow-warm px-2 py-2">
            <div className="flex items-center">
              <div className="grid grid-cols-6 gap-0 flex-1 px-3 py-2">
                {/* Search (col-span-2) */}
                <div className="col-span-2 flex items-center h-12 px-4">
                  <Search className="h-5 w-5 text-muted-foreground mr-3" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
                onClick={() => {
                  // Apply filters and search
                  console.log("Search with filters:", { query, filters, age, ageMonths, gender });
                }}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-10 md:space-y-12 mb-16 overflow-visible">
          {pageItems.map((pet) => (
            <div key={pet.id} className="border rounded-lg p-4 flex gap-4 items-center transition-smooth shadow-petcard m-2.5 overflow-visible">
              <img src={pet.image} alt={pet.name} className="w-28 h-28 rounded-md object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground truncate">{pet.name}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">{pet.gender}</Badge>
                    <Badge variant="secondary" className="bg-background/90 text-foreground">{pet.size}</Badge>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{pet.age}</span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{pet.location}</span>
                  </div>
                  <span className="truncate">{pet.breed}</span>
                </div>
              </div>
              <Button asChild className="shrink-0">
                <a href={`/pet/${pet.id}`}>자세히</a>
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => goToPage(Math.max(1, safePage - 1))}
            disabled={safePage <= 1}
          >
            {"<"}
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === safePage ? "default" : "outline"}
              onClick={() => goToPage(page)}
              className={page === safePage ? "bg-primary text-primary-foreground" : ""}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage >= totalPages}
          >
            {">"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pets;


