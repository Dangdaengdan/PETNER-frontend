import { useState, useRef } from "react";
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
import { createDog, DogCreateRequestDto } from "@/api/dog";
import { uploadImageToGCP } from "@/api/upload";
import { searchBreedByName } from "@/api/breed";
import { searchShelterByName } from "@/api/shelter";
import RegionSelector from "@/components/RegionSelector";
import ShelterSelector from "@/components/ShelterSelector";

// Dog breed data organized by size
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
};

const RegisterPet = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedShelterId, setSelectedShelterId] = useState<number | undefined>();
  const [selectedShelterName, setSelectedShelterName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dogSize: "",
    dogBreed: "",
    age: "",
    ageMonths: "",
    gender: "",
    weight: "",
    description: "",
    personality: "",
    medicalInfo: "",
  });

  const convertAgeToBirthDate = (age: string, ageMonths: string): string => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (age === "0" && ageMonths) {
      const monthsToSubtract = parseInt(ageMonths);
      let targetYear = currentYear;
      let targetMonth = currentMonth - monthsToSubtract;

      while (targetMonth <= 0) {
        targetYear -= 1;
        targetMonth += 12;
      }

      return `${targetYear}${targetMonth.toString().padStart(2, '0')}`;
    } else if (age && age !== "0") {
      const yearsToSubtract = parseInt(age);
      const targetYear = currentYear - yearsToSubtract;
      return `${targetYear}${currentMonth.toString().padStart(2, '0')}`;
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = "";

      if (uploadedFile) {
        imageUrl = await uploadImageToGCP(uploadedFile);
      }

      const breedResponse = await searchBreedByName(formData.dogBreed);

      const shelterId = selectedShelterId;
      if (selectedShelterId && selectedShelterName) {
        console.log("🏠 선택된 보호소:", { id: selectedShelterId, name: selectedShelterName });
      }

      const birthDate = convertAgeToBirthDate(formData.age, formData.ageMonths);

      const dogData: DogCreateRequestDto = {
        name: formData.name,
        breedId: breedResponse.breedId,
        birthDate: birthDate,
        gender: formData.gender === "male" ? "MALE" : "FEMALE",
        dogSize: formData.dogSize,
        weight: parseFloat(formData.weight),
        healthStatus: formData.medicalInfo || "",
        description: formData.description,
        adoptionStatus: "입양_가능",
        imageUrl: imageUrl,
        shelterId: shelterId || 0,
      };

      console.log("🐕 유기견 등록 API 요청 데이터:", JSON.stringify(dogData, null, 2));

      await createDog(dogData);
      alert("유기견이 성공적으로 등록되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("유기견 등록 실패:", error);
      alert("유기견 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary transition-smooth cursor-pointer"
                  onClick={handleUploadClick}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      <p className="text-base text-green-600">사진이 업로드되었습니다!</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-base text-muted-foreground mb-2">클릭하여 사진을 업로드하세요</p>
                      <p className="text-sm text-muted-foreground">
                        최대 1장까지 업로드 가능 (JPG, PNG)
                      </p>
                    </>
                  )}
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
                            <SelectItem value="소형">소형</SelectItem>
                            <SelectItem value="중형">중형</SelectItem>
                            <SelectItem value="대형">대형</SelectItem>
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

              {/* Shelter Information (Optional) */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  보호소 정보 (선택사항)
                </h3>
                <div>
                  <ShelterSelector
                    initialShelterId={selectedShelterId}
                    onShelterChange={(shelterId, shelterName) => {
                      setSelectedShelterId(shelterId);
                      setSelectedShelterName(shelterName);
                    }}
                    showSelectedBox={false}
                    label="보호소 선택"
                    placeholder="보호소를 선택하세요"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    보호소를 선택하면 해당 보호소와 연결됩니다.
                  </p>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  상세 정보
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="personality" className="text-base font-medium mb-3 block">성격 *</Label>
                    <Input
                      id="personality"
                      placeholder="예: 친근함, 활발함, 조용함"
                      value={formData.personality}
                      onChange={(e) => handleInputChange("personality", e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medicalInfo" className="text-base font-medium mb-3 block">의료 정보 *</Label>  {/* 건강상태*/}
                    <Textarea
                      id="medicalInfo"
                      placeholder="예방접종, 중성화 수술, 건강 상태 등"
                      value={formData.medicalInfo}
                      onChange={(e) => handleInputChange("medicalInfo", e.target.value)}
                      required
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
                  disabled={isSubmitting}
                  className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                >
                  {isSubmitting ? "등록 중..." : "등록하기"}
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