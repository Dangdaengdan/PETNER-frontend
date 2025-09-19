import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, MapPin, Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RegisterPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "",
    size: "",
    location: "",
    description: "",
    personality: "",
    medicalInfo: "",
    contactInfo: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log("Pet registration data:", formData);
    // Show success message or redirect
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto px-2 sm:px-4 lg:px-6 py-2 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">유기견 등록하기</h1>
          <p className="text-muted-foreground">
            새로운 가족을 찾을 수 있도록 반려동물 정보를 등록해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Photos and Basic Info */}
            <div className="space-y-6">
              {/* Photo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    사진 등록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">클릭하여 사진을 업로드하세요</p>
                    <p className="text-xs text-muted-foreground">
                      최대 5장까지 업로드 가능 (JPG, PNG)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    기본 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      placeholder="반려동물의 이름을 입력하세요"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="breed">품종 *</Label>
                    <Input
                      id="breed"
                      placeholder="예: 골든 리트리버, 페르시안 고양이"
                      value={formData.breed}
                      onChange={(e) => handleInputChange("breed", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">나이 *</Label>
                      <Input
                        id="age"
                        placeholder="예: 2년"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">성별 *</Label>
                      <Select onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="성별 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">수컷</SelectItem>
                          <SelectItem value="female">암컷</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="size">크기 *</Label>
                    <Select onValueChange={(value) => handleInputChange("size", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="크기 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">소형</SelectItem>
                        <SelectItem value="medium">중형</SelectItem>
                        <SelectItem value="large">대형</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="space-y-6">
              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    위치 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="location">현재 위치 *</Label>
                    <Input
                      id="location"
                      placeholder="예: 서울시 강남구, 부산 해운대구"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Information */}
              <Card>
                <CardHeader>
                  <CardTitle>상세 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="personality">성격</Label>
                    <Input
                      id="personality"
                      placeholder="예: 친근함, 활발함, 조용함"
                      value={formData.personality}
                      onChange={(e) => handleInputChange("personality", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="medicalInfo">의료 정보</Label>
                    <Textarea
                      id="medicalInfo"
                      placeholder="예방접종, 중성화 수술, 건강 상태 등"
                      value={formData.medicalInfo}
                      onChange={(e) => handleInputChange("medicalInfo", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">기타 설명 *</Label>
                    <Textarea
                      id="description"
                      placeholder="반려동물에 대한 자세한 설명을 작성해주세요"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    연락처 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="contactInfo">연락처 *</Label>
                    <Textarea
                      id="contactInfo"
                      placeholder="이름, 전화번호, 이메일 등 연락 가능한 정보"
                      value={formData.contactInfo}
                      onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-32"
            >
              취소
            </Button>
            <Button 
              type="submit" 
              className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              등록하기
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPet;