import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  petType: string;
  age: string;
  size: string;
  gender: string;
  location: string;
}

const SearchFilters = ({ onFilterChange }: SearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    petType: "",
    age: "",
    size: "",
    gender: "",
    location: ""
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      petType: "",
      age: "",
      size: "",
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
              <label className="text-sm font-medium text-foreground mb-2 block">동물 종류</label>
              <Select value={filters.petType} onValueChange={(value) => handleFilterChange("petType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">강아지</SelectItem>
                  <SelectItem value="cat">고양이</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <label className="text-sm font-medium text-foreground mb-2 block">크기</label>
              <Select value={filters.size} onValueChange={(value) => handleFilterChange("size", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">소형</SelectItem>
                  <SelectItem value="Medium">중형</SelectItem>
                  <SelectItem value="Large">대형</SelectItem>
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