import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  age: string;
  dogSize: string;
  dogBreed: string;
  gender: string;
  location: string;
}

// Dog breed data organized by size
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
};

const SearchFilters = ({ onFilterChange }: SearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    age: "",
    dogSize: "",
    dogBreed: "",
    gender: "",
    location: ""
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset breed when size changes
    if (key === 'dogSize') {
      newFilters.dogBreed = "";
    }
    
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      age: "",
      dogSize: "",
      dogBreed: "",
      gender: "",
      location: ""
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="w-full">
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full sm:w-auto mb-4 border-border hover:bg-muted transition-smooth"
      >
        <Filter className="mr-2 h-4 w-4" />
        필터 {hasActiveFilters && `(${Object.values(filters).filter(v => v).length})`}
      </Button>

      {isExpanded && (
        <div className="bg-card border border-border rounded-lg p-4 mb-4 space-y-4 shadow-warm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">검색 필터</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1 h-4 w-4" />
                초기화
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">나이</label>
              <Select value={filters.age} onValueChange={(value) => handleFilterChange("age", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="young">1세 미만</SelectItem>
                  <SelectItem value="adult">1-5세</SelectItem>
                  <SelectItem value="senior">5세 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">견종 크기</label>
              <Select value={filters.dogSize} onValueChange={(value) => handleFilterChange("dogSize", value)}>
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
              <Select 
                value={filters.dogBreed} 
                onValueChange={(value) => handleFilterChange("dogBreed", value)}
                disabled={!filters.dogSize}
              >
                <SelectTrigger>
                  <SelectValue placeholder={filters.dogSize ? "견종 선택" : "먼저 크기를 선택하세요"} />
                </SelectTrigger>
                <SelectContent>
                  {filters.dogSize && dogBreedsBySize[filters.dogSize as keyof typeof dogBreedsBySize]?.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">성별</label>
              <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">수컷</SelectItem>
                  <SelectItem value="Female">암컷</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">지역</label>
              <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seoul">서울</SelectItem>
                  <SelectItem value="busan">부산</SelectItem>
                  <SelectItem value="incheon">인천</SelectItem>
                  <SelectItem value="daegu">대구</SelectItem>
                  <SelectItem value="daejeon">대전</SelectItem>
                  <SelectItem value="gwangju">광주</SelectItem>
                  <SelectItem value="ulsan">울산</SelectItem>
                  <SelectItem value="gyeonggi">경기도</SelectItem>
                  <SelectItem value="gangwon">강원도</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;