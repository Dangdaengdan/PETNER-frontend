import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, MapPin, Heart, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegionSelector from "@/components/RegionSelector";
import PhoneNumberInput from "@/components/PhoneNumberInput";

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

const RegisterPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dogSize: "",
    dogBreed: "",
    age: "",
    ageMonths: "",
    gender: "",
    weight: "",
    province: "",
    city: "",
    description: "",
    personality: "",
    medicalInfo: "",
    phoneNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log("Pet registration data:", formData);
    // Show success message or redirect
  };

  const handleRegionChange = (province: string, city: string) => {
    setFormData(prev => ({ ...prev, province, city }));
  };

  const handleDogBreedChange = (key: 'dogSize' | 'dogBreed', value: string) => {
    const newFormData = { ...formData, [key]: value };
    
    // Reset breed when size changes
    if (key === 'dogSize') {
      newFormData.dogBreed = "";
    }
    
    setFormData(newFormData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="section-heading">유기견 등록하기</h2>
          <p className="text-lg text-muted-foreground">유기견이 새로운 가족을 찾을 수 있도록 유기견 정보를 입력해주세요.</p>
        </div>

        {/* Registration Form - Big Box Container */}
        <Card className="shadow-lg rounded-3xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Photo Upload */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  사진 등록
                </h3>
                <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary transition-smooth cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-base text-muted-foreground mb-2">클릭하여 사진을 업로드하세요</p>
                    <p className="text-sm text-muted-foreground">
                      최대 5장까지 업로드 가능 (JPG, PNG)
                    </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  기본 정보
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium mb-3 block">이름 *</Label>
                    <Input
                      id="name"
                      placeholder="반려동물의 이름을 입력하세요"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="gender" className="text-base font-medium mb-3 block">성별 *</Label>
                      <Select onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="성별 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">수컷</SelectItem>
                          <SelectItem value="female">암컷</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-base font-medium mb-3 block">무게 (kg) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="예: 5.5"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dogSize" className="text-base font-medium mb-3 block">견종*</Label>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <Select value={formData.dogSize} onValueChange={(value) => handleDogBreedChange("dogSize", value)}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="크기 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="소형견">소형</SelectItem>
                            <SelectItem value="중형견">중형</SelectItem>
                            <SelectItem value="대형견">대형</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select 
                          value={formData.dogBreed} 
                          onValueChange={(value) => handleDogBreedChange("dogBreed", value)}
                          disabled={!formData.dogSize}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder={formData.dogSize ? "견종 선택" : "먼저 크기를 선택하세요"} />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.dogSize && dogBreedsBySize[formData.dogSize as keyof typeof dogBreedsBySize]?.map((breed) => (
                              <SelectItem key={breed} value={breed}>
                                {breed}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="age" className="text-base font-medium mb-3 block">나이 * (추정되는 나이를 적어주세요)</Label>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="age"
                            type="number"
                            min="0"
                            placeholder="(예: 2)"
                            value={formData.age}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleInputChange("age", value);
                              // If age is not 0, clear months
                              if (value !== "0" && value !== "") {
                                handleInputChange("ageMonths", "");
                              }
                            }}
                            required
                            className="rounded-xl"
                          />
                          <span className="text-base text-gray-500 whitespace-nowrap">
                            세
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="ageMonths"
                            type="number"
                            min="1"
                            max="11"
                            placeholder="(0세일 때만)"
                            value={formData.ageMonths}
                            onChange={(e) => handleInputChange("ageMonths", e.target.value)}
                            disabled={formData.age !== "0"}
                            className="rounded-xl"
                          />
                          <span className="text-base text-gray-500 whitespace-nowrap">
                            개월
                          </span>
                        </div>
                      </div>
                    </div>
                    {formData.age === "0" && formData.ageMonths && (
                      <p className="text-base text-blue-600 mt-1">
                        ✓ {formData.ageMonths}개월로 등록됩니다
                      </p>
                    )}
                    {formData.age !== "0" && formData.age && (
                      <p className="text-base text-blue-600 mt-1">
                        ✓ {formData.age}세로 등록됩니다
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  위치 정보
                </h3>
                <RegionSelector onRegionChange={handleRegionChange} />
              </div>

              {/* Detailed Information */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  상세 정보
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="personality" className="text-base font-medium mb-3 block">성격</Label>
                    <Input
                      id="personality"
                      placeholder="예: 친근함, 활발함, 조용함"
                      value={formData.personality}
                      onChange={(e) => handleInputChange("personality", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medicalInfo" className="text-base font-medium mb-3 block">의료 정보</Label>  {/* 건강상태*/}
                    <Textarea
                      id="medicalInfo"
                      placeholder="예방접종, 중성화 수술, 건강 상태 등"
                      value={formData.medicalInfo}
                      onChange={(e) => handleInputChange("medicalInfo", e.target.value)}
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-base font-medium mb-3 block">기타 설명 *</Label>
                    <Textarea
                      id="description"
                      placeholder="반려동물에 대한 자세한 설명을 작성해주세요"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  연락처 정보
                </h3>
                <div>
                  <Label htmlFor="phoneNumber" className="text-base font-medium mb-3 block">휴대폰 번호 *</Label>
                  <PhoneNumberInput
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange("phoneNumber", value)}
                    placeholder="010-0000-0000"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-32 rounded-xl"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                >
                  등록하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPet;