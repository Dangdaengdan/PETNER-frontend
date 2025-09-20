import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RegionSelectorProps {
  onRegionChange?: (province: string, city: string) => void;
  initialProvince?: string;
  initialCity?: string;
}

const RegionSelector = ({ onRegionChange, initialProvince, initialCity }: RegionSelectorProps) => {
  const [selectedProvince, setSelectedProvince] = useState(initialProvince || "");
  const [selectedCity, setSelectedCity] = useState(initialCity || "");

  // Region data
  const regionData = [
    ['서울특별시', '강남구'],
    ['서울특별시', '강동구'],
    ['서울특별시', '강북구'],
    ['서울특별시', '강서구'],
    ['서울특별시', '관악구'],
    ['서울특별시', '광진구'],
    ['서울특별시', '구로구'],
    ['서울특별시', '금천구'],
    ['서울특별시', '노원구'],
    ['서울특별시', '도봉구'],
    ['서울특별시', '동대문구'],
    ['서울특별시', '동작구'],
    ['서울특별시', '마포구'],
    ['서울특별시', '서대문구'],
    ['서울특별시', '서초구'],
    ['서울특별시', '성동구'],
    ['서울특별시', '성북구'],
    ['서울특별시', '송파구'],
    ['서울특별시', '양천구'],
    ['서울특별시', '영등포구'],
    ['서울특별시', '용산구'],
    ['서울특별시', '은평구'],
    ['서울특별시', '종로구'],
    ['서울특별시', '중구'],
    ['서울특별시', '중랑구'],
    ['부산광역시', '중구'],
    ['부산광역시', '서구'],
    ['부산광역시', '동구'],
    ['부산광역시', '영도구'],
    ['부산광역시', '부산진구'],
    ['부산광역시', '동래구'],
    ['부산광역시', '남구'],
    ['부산광역시', '북구'],
    ['부산광역시', '해운대구'],
    ['부산광역시', '사하구'],
    ['부산광역시', '금정구'],
    ['부산광역시', '강서구'],
    ['부산광역시', '연제구'],
    ['부산광역시', '수영구'],
    ['부산광역시', '사상구'],
    ['대구광역시', '중구'],
    ['대구광역시', '동구'],
    ['대구광역시', '서구'],
    ['대구광역시', '남구'],
    ['대구광역시', '북구'],
    ['대구광역시', '수성구'],
    ['대구광역시', '달서구'],
    ['대구광역시', '달성군'],
    ['인천광역시', '중구'],
    ['인천광역시', '동구'],
    ['인천광역시', '미추홀구'],
    ['인천광역시', '연수구'],
    ['인천광역시', '남동구'],
    ['인천광역시', '부평구'],
    ['인천광역시', '계양구'],
    ['인천광역시', '서구'],
    ['광주광역시', '동구'],
    ['광주광역시', '서구'],
    ['광주광역시', '남구'],
    ['광주광역시', '북구'],
    ['광주광역시', '광산구'],
    ['대전광역시', '동구'],
    ['대전광역시', '중구'],
    ['대전광역시', '서구'],
    ['대전광역시', '유성구'],
    ['대전광역시', '대덕구'],
    ['울산광역시', '중구'],
    ['울산광역시', '남구'],
    ['울산광역시', '동구'],
    ['울산광역시', '북구'],
    ['울산광역시', '울주군'],
    ['경기도', '수원시'],
    ['경기도', '성남시'],
    ['경기도', '고양시'],
    ['경기도', '용인시'],
    ['경기도', '부천시'],
    ['경기도', '안산시'],
    ['경기도', '안양시'],
    ['경기도', '남양주시'],
    ['경기도', '화성시'],
    ['경기도', '평택시'],
    ['경기도', '의정부시'],
    ['경기도', '시흥시'],
    ['경기도', '파주시'],
    ['경기도', '광명시'],
    ['경기도', '김포시'],
    ['경기도', '군포시'],
    ['경기도', '하남시'],
    ['경기도', '오산시'],
    ['경기도', '이천시'],
    ['경기도', '안성시'],
    ['경기도', '구리시'],
    ['경기도', '포천시'],
    ['경기도', '의왕시'],
    ['경기도', '양주시'],
    ['경기도', '동두천시'],
    ['경기도', '과천시'],
    ['경기도', '가평군'],
    ['경기도', '연천군'],
    ['강원도', '춘천시'],
    ['강원도', '원주시'],
    ['강원도', '강릉시'],
    ['강원도', '동해시'],
    ['강원도', '태백시'],
    ['강원도', '속초시'],
    ['강원도', '삼척시'],
    ['충청북도', '청주시'],
    ['충청북도', '충주시'],
    ['충청북도', '제천시'],
    ['충청남도', '천안시'],
    ['충청남도', '공주시'],
    ['충청남도', '보령시'],
    ['충청남도', '아산시'],
    ['충청남도', '서산시'],
    ['충청남도', '논산시'],
    ['충청남도', '계룡시'],
    ['충청남도', '당진시'],
    ['전라북도', '전주시'],
    ['전라북도', '군산시'],
    ['전라북도', '익산시'],
    ['전라북도', '정읍시'],
    ['전라북도', '남원시'],
    ['전라북도', '김제시'],
    ['전라남도', '목포시'],
    ['전라남도', '여수시'],
    ['전라남도', '순천시'],
    ['전라남도', '나주시'],
    ['전라남도', '광양시'],
    ['경상북도', '포항시'],
    ['경상북도', '경주시'],
    ['경상북도', '김천시'],
    ['경상북도', '안동시'],
    ['경상북도', '구미시'],
    ['경상북도', '영주시'],
    ['경상북도', '영천시'],
    ['경상북도', '상주시'],
    ['경상북도', '문경시'],
    ['경상북도', '경산시'],
    ['경상남도', '창원시'],
    ['경상남도', '진주시'],
    ['경상남도', '통영시'],
    ['경상남도', '사천시'],
    ['경상남도', '김해시'],
    ['경상남도', '밀양시'],
    ['경상남도', '거제시'],
    ['경상남도', '양산시'],
    ['제주특별자치도', '제주시'],
    ['제주특별자치도', '서귀포시']
  ];

  // Get unique provinces
  const provinces = [...new Set(regionData.map(item => item[0]))];

  // Get cities for selected province
  const getCitiesForProvince = (province: string) => {
    return regionData
      .filter(item => item[0] === province)
      .map(item => item[1]);
  };

  // Handle province change
  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedCity(""); // Reset city when province changes
    
    // Auto-select first city if available
    const cities = getCitiesForProvince(province);
    if (cities.length > 0) {
      setSelectedCity(cities[0]);
      onRegionChange?.(province, cities[0]);
    } else {
      onRegionChange?.(province, "");
    }
  };

  // Handle city change
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onRegionChange?.(selectedProvince, city);
  };

  // Initialize with first province and city
  useEffect(() => {
    if (!selectedProvince && provinces.length > 0) {
      const firstProvince = provinces[0];
      const firstCity = getCitiesForProvince(firstProvince)[0];
      setSelectedProvince(firstProvince);
      setSelectedCity(firstCity);
      onRegionChange?.(firstProvince, firstCity);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="province">시/도 *</Label>
        <Select value={selectedProvince} onValueChange={handleProvinceChange}>
          <SelectTrigger>
            <SelectValue placeholder="시/도를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="city">시/군/구 *</Label>
        <Select 
          value={selectedCity} 
          onValueChange={handleCityChange}
          disabled={!selectedProvince}
        >
          <SelectTrigger>
            <SelectValue placeholder={selectedProvince ? "시/군/구를 선택하세요" : "먼저 시/도를 선택하세요"} />
          </SelectTrigger>
          <SelectContent>
            {selectedProvince && getCitiesForProvince(selectedProvince).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProvince && selectedCity && (
        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">선택된 지역:</span> {selectedProvince} {selectedCity}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
