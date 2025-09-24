import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RegionSelector from "@/components/RegionSelector";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Heart } from "lucide-react";
import kakaoLogo from "@/assets/kakao-logo.png";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // called when login/signup completes
}

const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    password: "",
    email: "",
    gender: "",
    housing: "",
    phoneNumber: "",
    province: "",
    city: "",
  });
  const existingIds = ["admin", "test", "petner", "demo"]; // mock for duplicate check

  const handleRegionChange = (province: string, city: string) => {
    setForm((prev) => ({ ...prev, province, city }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend validations (all required)
    if (!form.userId.trim() || !form.password.trim() || !form.email.trim() ||
        !form.gender || !form.housing || !form.phoneNumber.trim() || !form.province) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    // Region validation: require province; city optional
    // Unique ID check (mock)
    if (existingIds.includes(form.userId.trim().toLowerCase())) {
      alert("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
      return;
    }
    // TODO: integrate API
    console.log("User profile submit", form);
    alert("회원가입에 성공하였습니다.");
    if (onSuccess) onSuccess();
    setShowProfileModal(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {!showProfileModal ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-primary fill-current" />
                <span className="text-2xl font-handwritten font-bold text-primary">
                  Petner
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">로그인</h1>
              <p className="text-muted-foreground">펫너에서 새로운 가족을 만나보세요</p>
            </DialogTitle>
          </DialogHeader>

          <Card className="border-border shadow-elegant">
            <CardContent className="space-y-4 pt-6">
              {/* Social Login */}
              <Button 
                variant="kakao" 
                className="w-full h-12 text-base font-medium"
                onClick={() => setShowProfileModal(true)}
              >
                <img src={kakaoLogo} alt="카카오" className="mr-2 h-5 w-5" />
                카카오로 3초만에 시작하기
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-4 text-sm text-muted-foreground">
            <p>로그인하면 Petner의 서비스 약관 및 개인정보 보호정책에 동의하게 됩니다.</p>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">회원정보 입력</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userId">아이디</Label>
                <Input id="userId" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <Label>성별</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택하기" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>주거형태</Label>
                <Select value={form.housing} onValueChange={(v) => setForm({ ...form, housing: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택하기" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">아파트</SelectItem>
                    <SelectItem value="house">단독주택</SelectItem>
                    <SelectItem value="multi">공용주택</SelectItem>
                    <SelectItem value="studio">원룸</SelectItem>
                    <SelectItem value="etc">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>연락처</Label>
                <PhoneNumberInput
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={(value) => setForm({ ...form, phoneNumber: value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>지역</Label>
                <RegionSelector
                  showSelectedBox={false}
                  onRegionChange={handleRegionChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowProfileModal(false)}>뒤로</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">완료</Button>
            </div>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default LoginModal;
