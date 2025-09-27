import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ShelterSelectorProps {
  onShelterChange?: (shelterId: number, shelterName: string) => void;
  initialShelterId?: number;
  showSelectedBox?: boolean;
  label?: string;
  placeholder?: string;
}

const ShelterSelector = ({
  onShelterChange,
  initialShelterId,
  showSelectedBox = true,
  label = "보호소",
  placeholder = "보호소를 선택하세요"
}: ShelterSelectorProps) => {
  const [selectedShelterId, setSelectedShelterId] = useState<number | undefined>(initialShelterId);
  const [selectedShelterName, setSelectedShelterName] = useState<string>("");

  // Shelter data
  const shelters = [
    { id: 1, name: '띵지 보호소', address: '처인구 명지로 116', contact: '031-330-6247' },
    { id: 2, name: '군산 유기동물 보호센터', address: '나포면 서왕길 52', contact: '063-454-3475' },
    { id: 3, name: '내 사랑 바둑이', address: '금신로 20번길 36', contact: '031-821-2272' },
    { id: 4, name: '더함', address: '성동면 개척로 165-3', contact: '041-734-1911' },
    { id: 5, name: '도로시 지켜줄개', address: '덕양구 고양대로 1695', contact: '031-968-3555' },
    { id: 6, name: '도그마루', address: '올림픽로 99 2층', contact: '1566-8713' },
    { id: 7, name: '동물사랑 길천사', address: '제도로 726', contact: '062-574-7734' },
    { id: 8, name: '동행', address: '행구로 370', contact: '033-764-8253' },
    { id: 9, name: '리버스 (Re:Birth)', address: '낭산면 함낭로 1335-15', contact: '010-5469-8240' },
    { id: 10, name: '미소사랑', address: '사천면 중앙서로 439-50', contact: '033-648-1116' },
    { id: 11, name: '사랑의 쉼터', address: '현곡면 용담로 136-40', contact: '010-3841-6628' },
    { id: 12, name: '사랑이네집', address: '상북면 상삼동길 15-22', contact: '010-3873-1679' },
    { id: 13, name: '생명사랑 보호소', address: '남구 오천읍 정몽주로329번길 57-16', contact: '010-3529-6985' },
    { id: 14, name: '생명수', address: '영인면 신봉길 288', contact: '041-533-2695' },
    { id: 15, name: '시흥 엔젤홈 보호소', address: '정왕동 2133-2', contact: '010-8919-8369' },
    { id: 16, name: '아지네마을', address: '하성면 하성로 320-131', contact: '010-8718-2080' },
    { id: 17, name: '아이들세상', address: '이인면 주봉리', contact: '010-9226-5226' },
    { id: 18, name: '아이러브애니멀', address: '상당구 목련로 202-1', contact: '043-221-7942' },
    { id: 19, name: '아이조아', address: '주촌면 서부로1703번길 182-52', contact: '055-314-8249' },
    { id: 20, name: '여수 유기견보호소', address: '소라면 서부로 932', contact: '061-683-2595' },
    { id: 21, name: '울산 행복한 보금자리', address: '상북면 명촌길천로 53', contact: '052-258-2331' },
    { id: 22, name: '위드 (With)', address: '세하동 328-3', contact: '062-574-7734' },
    { id: 23, name: '이천 사랑의 보금자리', address: '율면 임오산로 224', contact: '010-5309-1718' },
    { id: 24, name: '제주 동물친구들', address: '애월읍 평화로 2680', contact: '064-792-5400' },
    { id: 25, name: '창원 동물보호센터', address: '마산합포구 진북면 지산2길 167-15', contact: '055-225-5421' },
    { id: 26, name: '천안시 유기동물보호소', address: '동남구 풍세면 풍세로 786', contact: '041-522-8269' },
    { id: 27, name: '코리안독스', address: '수동면 비룡로 782번길 132', contact: '031-595-6358' },
    { id: 28, name: '팅커벨', address: '양천로 57길 22-19', contact: '02-2647-8255' },
    { id: 29, name: '평택 행복한 아이들 보호소', address: '진위면 동천길 112-25', contact: '010-8021-3601' },
    { id: 30, name: '한나네 보호소', address: '아양로 288', contact: ' 053-964-6258' },
    { id: 31, name: '행동하는 동물사랑', address: '탄현면 갈현리 813-1', contact: '031-948-0754' },
    { id: 32, name: '행복날개', address: '광도면 노산리 914-3', contact: '055-649-8253' },
    { id: 33, name: '호호쉼터', address: '서귀포시 대정읍', contact: '010-5755-8339' },
    { id: 34, name: '화성 꽁꽁이네', address: '남양읍 주석로 212번길 32-21', contact: '010-4849-9339' },
    { id: 35, name: '하이바이 분양소', address: '와부읍 도곡리 788-4', contact: '010-4284-3233' }
  ];

  // Handle shelter change
  const handleShelterChange = (shelterId: string) => {
    const selectedId = parseInt(shelterId);
    const shelter = shelters.find(s => s.id === selectedId);

    setSelectedShelterId(selectedId);
    setSelectedShelterName(shelter?.name || "");

    if (shelter) {
      onShelterChange?.(selectedId, shelter.name);
    }
  };

  // Initialize with initial values if provided
  useEffect(() => {
    if (initialShelterId) {
      const shelter = shelters.find(s => s.id === initialShelterId);
      if (shelter) {
        setSelectedShelterName(shelter.name);
        onShelterChange?.(initialShelterId, shelter.name);
      }
    }
  }, [initialShelterId]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="shelter">{label}</Label>
        <Select value={selectedShelterId?.toString() || ""} onValueChange={handleShelterChange}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {shelters.map((shelter) => (
              <SelectItem key={shelter.id} value={shelter.id.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{shelter.name}</span>
                  <span className="text-xs text-muted-foreground">{shelter.address}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showSelectedBox && selectedShelterId && selectedShelterName && (
        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">선택된 보호소:</span> {selectedShelterName}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShelterSelector;