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
import { ProtectedImage } from "@/components/ProtectedImage";
import { getDogs, DogListResponseDto, searchDogs, DogSearchRequestDto } from "@/api/dog";
import { calculateAge } from "@/utils/ageCalculator";

const ITEMS_PER_PAGE = 6;

const Pets = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = Math.max(1, Number(params.get("page") || 1));
  const [query, setQuery] = useState<string>(params.get("q") || "");

  // API state
  const [dogs, setDogs] = useState<DogListResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Filter states (same as Home)
  const [filters, setFilters] = useState({ dogSize: "", dogBreed: "", location: "" });
  const [regionProvince, setRegionProvince] = useState("");
  const [regionCity, setRegionCity] = useState("");
  const [gender, setGender] = useState("");

  // Dog breed data (same as Home)
  const dogBreedsBySize = {
    '소형': [
      '토이 푸들', '말티즈', '요크셔테리어', '포메라니안', '치와와', '시츄',
      '잭 러셀 테리어', '보스턴 테리어', '카발리에 킹 찰스 스파니엘',
      '이탈리안 그레이하운드', '미니어처 슈나우저', '핀셔', '미니어처 핀셔',
      '위펫', '휘펫', '혼합견', '기타'
    ],
    '중형': [
      '보더 콜리', '푸들', '비글', '불독', '웰시코기', '진돗개', '풍산개',
      '삽살개', '코카스파니엘', '바셋 하운드', '브리타니 스파니엘',
      '시베리안 허스키', '슈나우저', '불 테리어', '스태퍼드셔 불 테리어',
      '아메리칸 스태퍼드셔 테리어', '핏불 테리어', '바이센지', '세터',
      '포인터', '혼합견', '기타'
    ],
    '대형': [
      '골든 리트리버', '래브라도 리트리버', '저먼 셰퍼드', '로트와일러',
      '도베르만', '도베르만 핀셔', '사모예드', '아키타', '복서', '그레이트 데인',
      '세인트 버나드', '마스티프', '차우차우', '알래스칸 말라뮤트', '달마시안',
      '와이마라너', '비즐라', '아프간 하운드', '그레이하운드', '자이언트 슈나우저',
      '로디지안 리지백', '파라오 하운드', '이비자 하운드', '살루키', '보르조이',
      '아이리시 울프하운드', '스코티시 디어하운드', '혼합견', '기타'
    ]
  } as const;

  // Load dogs data
  useEffect(() => {
    const loadDogs = async () => {
      try {
        setLoading(true);
        // API는 0 based pagination이므로 currentPage - 1
        const data = await getDogs(currentPage - 1, ITEMS_PER_PAGE);

        // "입양_가능" 상태인 유기견만 필터링
        const availableDogs = data.filter(dog => dog.adoptionStatus === "입양_가능");
        setDogs(availableDogs);

        // 서버에서 전체 페이지 수를 제공하지 않으므로, 받은 데이터로 추정
        // 받은 데이터가 페이지 크기와 같으면 다음 페이지가 있을 수 있음
        if (data.length === ITEMS_PER_PAGE) {
          setTotalPages(currentPage + 1); // 최소한 다음 페이지까지는 있다고 가정
        } else {
          setTotalPages(currentPage); // 현재 페이지가 마지막
        }
      } catch (error) {
        console.error("유기견 목록 로드 실패:", error);
        setDogs([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadDogs();
  }, [currentPage]);

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


  const goToPage = (page: number) => {
    const q = query ? `&q=${encodeURIComponent(query)}` : "";
    navigate(`/pets?page=${page}${q}`);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setIsSearchMode(true);

      // 모든 검색 조건이 비어있으면 경고
      const hasSearchCriteria = query.trim() || filters.dogSize || filters.dogBreed || gender || filters.location;
      if (!hasSearchCriteria) {
        alert('검색 조건을 하나 이상 입력해주세요.');
        setLoading(false);
        setIsSearchMode(false);
        return;
      }

      // 검색 파라미터 구성
      const searchParams: DogSearchRequestDto = {
        page: 0,
        size: ITEMS_PER_PAGE
      };

      // 이름 검색
      if (query.trim()) {
        searchParams.q = query.trim();
        console.log('이름 검색:', query.trim());
      }

      // 견종 검색 (dogSize 또는 breedName)
      if (filters.dogSize) {
        searchParams.dogSize = filters.dogSize;
        console.log('견종 크기:', filters.dogSize);
      }
      if (filters.dogBreed) {
        searchParams.breedName = filters.dogBreed;
        console.log('견종명:', filters.dogBreed);
      }

      // 성별 검색
      if (gender) {
        searchParams.gender = gender === "male" ? "MALE" : "FEMALE";
        console.log('성별:', searchParams.gender);
      }

      // 지역 검색
      if (filters.location) {
        searchParams.location = filters.location;
        console.log('지역:', filters.location);
      }

      console.log('🔍 최종 검색 파라미터:', searchParams);
      console.log('🔍 현재 필터 상태:', { query, filters, gender });

      const searchResults = await searchDogs(searchParams);
      console.log('🔍 검색 결과:', searchResults);

      // DogListResponseDto 형태로 변환
      const convertedResults: DogListResponseDto[] = searchResults.map(result => ({
        dogId: result.dogId,
        name: result.name,
        breedName: result.breedName,
        gender: result.gender,
        dogSize: result.dogSize,
        weight: result.weight,
        adoptionStatus: result.adoptionStatus,
        imageUrl: result.imageUrl,
        memberNickname: "", // 검색 결과에 없음
        shelterName: result.shelterName,
        birthDate: result.birthDate,
        createdAt: result.createdAt
      }));

      // "입양_가능" 상태인 유기견만 필터링
      const availableResults = convertedResults.filter(dog => dog.adoptionStatus === "입양_가능");
      setDogs(availableResults);
      setTotalPages(1); // 검색 모드에서는 페이지네이션 비활성화
    } catch (error) {
      console.error("검색 실패:", error);
      setDogs([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setIsSearchMode(false);
    setQuery("");
    setFilters({ dogSize: "", dogBreed: "", location: "" });
    setGender("");
    setRegionProvince("");
    setRegionCity("");

    // 기본 목록 다시 로드
    try {
      setLoading(true);
      const data = await getDogs(currentPage - 1, ITEMS_PER_PAGE);
      setDogs(data);
      if (data.length === ITEMS_PER_PAGE) {
        setTotalPages(currentPage + 1);
      } else {
        setTotalPages(currentPage);
      }
    } catch (error) {
      console.error("유기견 목록 로드 실패:", error);
      setDogs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
         {/* Search CTA */}
         <div className="mb-12 md:mb-16 text-center">
          <h2 className="section-heading">유기견 검색하기</h2>
          <p className="text-lg text-muted-foreground">원하는 조건을 선택하면 나와 맞는 유기견을 빠르게 검색할 수 있습니다.</p>
        </div>

        <div className="mb-16">
          <div className="w-full max-w-3xl mx-auto rounded-full bg-brown-100 border border-brown-400 shadow-warm px-2 py-2 transition-smooth hover:shadow-xl hover:-translate-y-0.5 will-change-transform">
            <div className="flex items-center">
              <div className="grid grid-cols-5 gap-0 flex-1 px-3 py-2">
                {/* Search (col-span-2) */}
                <div className="col-span-2 flex items-center h-12 px-4">
                  <Search className="h-5 w-5 text-neutral-700 mr-3" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="이름으로 검색"
                    className="h-10 bg-transparent border-0 focus-visible:ring-0 focus:ring-0 focus:outline-none focus-visible:outline-none focus:border-transparent focus-visible:ring-offset-0 px-0"
                  />
                </div>
                {/* Breed (col-span-1) */}
                <div className="col-span-1 flex items-center h-12 px-4 border-l border-neutral-200">
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 text-left w-full whitespace-nowrap">
                      <span className="text-sm text-neutral-700">견종</span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {filters.dogBreed || filters.dogSize || "선택"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 rounded-2xl bg-brown-100 border border-brown-400" align="start" side="bottom" sideOffset={40} alignOffset={-16} avoidCollisions={false} collisionPadding={0}>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">견종 크기</label>
                          <Select value={filters.dogSize} onValueChange={(v) => handleFilterChange('dogSize', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="선택하기" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="소형">소형</SelectItem>
                              <SelectItem value="중형">중형</SelectItem>
                              <SelectItem value="대형">대형</SelectItem>
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
                {/* Gender (col-span-1) */}
                <div className="col-span-1 flex items-center h-12 px-4 border-l border-neutral-200">
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 text-left w-full whitespace-nowrap">
                      <span className="text-sm text-neutral-700">성별</span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {gender === "male" ? "수컷" : gender === "female" ? "암컷" : "선택"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 rounded-2xl bg-brown-100 border border-brown-400" align="start" side="bottom" sideOffset={40} alignOffset={-16} avoidCollisions={false} collisionPadding={0}>
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
                <div className="col-span-1 flex items-center h-12 px-4 border-l border-neutral-200">
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 text-left w-full whitespace-nowrap">
                      <span className="text-sm text-neutral-700">지역</span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {filters.location || "선택"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] rounded-2xl bg-brown-100 border border-brown-400" align="end" side="bottom" sideOffset={40} alignOffset={-90} avoidCollisions={false} collisionPadding={0}>
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
                className="mr-2 h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-700 transition-smooth"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>


        {/* 검색 결과 표시 및 초기화 버튼 */}
        {isSearchMode && (
          <div className="mb-6 flex items-center justify-between bg-muted/50 rounded-lg p-4">
            <div>
              <p className="text-sm text-muted-foreground">
                검색 결과: <strong>{dogs.length}마리</strong>의 유기견을 찾았습니다.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearSearch}
              className="text-sm"
            >
              검색 초기화
            </Button>
          </div>
        )}

        {loading ? (
          <div className="space-y-6 mb-20">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 flex gap-4 items-center animate-pulse transition-smooth hover:-translate-y-1 hover:shadow-xl will-change-transform">
                <div className="w-28 h-28 bg-gray-200 rounded-md flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded shrink-0"></div>
              </div>
            ))}
          </div>
        ) : dogs.length === 0 ? (
          <div className="text-center py-60">
            <p className="text-lg text-muted-foreground">등록된 유기견이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-14 md:space-y-16 mb-20 overflow-visible">
            {dogs.map((dog) => (
              <div key={dog.dogId} className="border rounded-2xl p-6 py-8 min-h-44 flex gap-6 items-center transition-smooth shadow-petcard m-2.5 overflow-visible hover:-translate-y-1 hover:shadow-xl will-change-transform">
                <div className="w-28 h-28 flex-shrink-0">
                  {dog.imageUrl ? (
                    <ProtectedImage
                      objectName={dog.imageUrl}
                      alt={dog.name}
                      className="w-28 h-28 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
                      이미지 없음
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h3 className="text-2xl font-semibold text-foreground truncate">{dog.name}</h3>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-sm px-3 py-1">
                      {dog.gender === 'MALE' ? '수컷' : '암컷'}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 text-sm px-3 py-1">{dog.dogSize}</Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{calculateAge(dog.birthDate)}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{dog.shelterName || "보호소 정보 없음"}</span>
                    </div>
                    <span className="truncate">{dog.breedName}</span>
                  </div>
                </div>
                <div className="shrink-0 mr-4">
                  <Badge variant="secondary" className="bg-background/90 text-foreground text-xs px-2 py-1">
                    {dog.healthStatus ? dog.healthStatus : "건강 정보 없음"}
                  </Badge>
                </div>
                <Button asChild className="shrink-0 mr-10">
                  <a href={`/pet/${dog.dogId}`}>자세히</a>
                </Button>
              </div>
            ))}
          </div>
        )}

        {!loading && dogs.length > 0 && !isSearchMode && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              {"<"}
            </Button>

            {/* 현재 페이지 주변 페이지들만 표시 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, currentPage - 2);
              const page = startPage + i;
              if (page > totalPages) return null;

              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => goToPage(page)}
                  className={page === currentPage ? "bg-primary text-primary-foreground" : ""}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={dogs.length < ITEMS_PER_PAGE}
            >
              {">"}
            </Button>
          </div>
        )}
      </main>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Pets;

