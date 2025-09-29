import { useState, useEffect } from "react";
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
import { initiateKakaoLogin, handleKakaoCallback, getCurrentMember } from "@/api/auth";
import { completeProfile, checkNickname, checkEmail } from "@/api/member";
import { searchLocationByName } from "@/api/location";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // called when login/signup completes
  kakaoCode?: string; // 카카오 인증 코드 전달
  isProfileCompletionRequired?: boolean;
}

const LoginModal = ({ isOpen, onClose, onSuccess, kakaoCode, isProfileCompletionRequired }: LoginModalProps) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [kakaoUserInfo, setKakaoUserInfo] = useState<any>(null);

  const [form, setForm] = useState({
    nickname: "",
    email: "",
    gender: "",
    housingType: "",
    contact: "",
    state: "",
    district: "",
    locationId: 0,
  });

  const [validation, setValidation] = useState({
    isNicknameAvailable: false,
    isEmailAvailable: false,
    nicknameMessage: "",
    emailMessage: "",
  });

  useEffect(() => {
    if (isOpen && isProfileCompletionRequired) {
      setShowProfileModal(true);
    }
    if (!isOpen) {
      setShowProfileModal(false);
      // Reset form and validation when modal closes
      setForm({
        nickname: "", email: "", gender: "", housingType: "",
        contact: "", state: "", district: "", locationId: 0,
      });
      setValidation({
        isNicknameAvailable: false, isEmailAvailable: false,
        nicknameMessage: "", emailMessage: "",
      });
    }
  }, [isOpen, isProfileCompletionRequired]);

  useEffect(() => {
    if (kakaoCode && isOpen) {
      if (kakaoCode === 'success') {
        handleKakaoSuccessProcess();
      } else {
        handleKakaoCallbackProcess(kakaoCode);
      }
    }
  }, [kakaoCode, isOpen]);

  // Debounce for nickname validation
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (form.nickname === "") {
        setValidation(prev => ({ ...prev, isNicknameAvailable: false, nicknameMessage: "" }));
        return;
      }

      // 닉네임 길이 및 형식 검증
      if (form.nickname.length < 2) {
        setValidation(prev => ({ ...prev, isNicknameAvailable: false, nicknameMessage: "닉네임은 2자 이상이어야 합니다." }));
        return;
      }

      if (form.nickname.length > 20) {
        setValidation(prev => ({ ...prev, isNicknameAvailable: false, nicknameMessage: "닉네임은 20자 이하여야 합니다." }));
        return;
      }

      try {
        const res = await checkNickname(form.nickname);
        if (res.available) {
          setValidation(prev => ({ ...prev, isNicknameAvailable: true, nicknameMessage: "사용 가능한 닉네임입니다." }));
        } else {
          setValidation(prev => ({ ...prev, isNicknameAvailable: false, nicknameMessage: "이미 사용 중인 닉네임입니다." }));
        }
      } catch (error) {
        setValidation(prev => ({ ...prev, isNicknameAvailable: false, nicknameMessage: "닉네임 확인 중 오류가 발생했습니다." }));
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [form.nickname]);

  // Debounce for email validation
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setValidation(prev => ({ ...prev, isEmailAvailable: false, emailMessage: "" }));
        return;
      }
      try {
        const res = await checkEmail(form.email);
        if (res.available) {
          setValidation(prev => ({ ...prev, isEmailAvailable: true, emailMessage: "사용 가능한 이메일입니다." }));
        } else {
          setValidation(prev => ({ ...prev, isEmailAvailable: false, emailMessage: "이미 사용 중인 이메일입니다." }));
        }
      } catch (error) {
        setValidation(prev => ({ ...prev, isEmailAvailable: false, emailMessage: "이메일 확인 중 오류가 발생했습니다." }));
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [form.email]);

  const handleKakaoCallbackProcess = async (code: string) => {
    try {
      const response = await handleKakaoCallback(code);
      if (response.message === '로그인 성공') {
        const memberInfo = await getCurrentMember();
        if (memberInfo.profileCompleted) {
          if (onSuccess) onSuccess();
          onClose();
        } else {
          setKakaoUserInfo(memberInfo);
          setShowProfileModal(true);
        }
      }
    } catch (error) {
      console.error('카카오 로그인 처리 실패:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleKakaoSuccessProcess = async () => {
    try {
      const memberInfo = await getCurrentMember();
      if (memberInfo.profileCompleted) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setKakaoUserInfo(memberInfo);
        setShowProfileModal(true);
      }
    } catch (error) {
      console.error('카카오 성공 처리 실패:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleKakaoLogin = () => {
    initiateKakaoLogin();
  };

  const handleRegionChange = (state: string, district: string) => {
    setForm((prev) => ({ ...prev, state, district }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("입력 양식을 다시 확인해주세요.");
      return;
    }

    try {
      // 지역 정보 API 호출하여 locationId 조회
      let locationId = 0;
      if (form.state && form.district) {
        try {
          const locationName = `${form.state} ${form.district}`;
          const locationData = await searchLocationByName(locationName);
          locationId = locationData.locationId;
        } catch (error) {
          console.error('지역 정보 조회 실패:', error);
          alert('지역 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
          return;
        }
      }

      const profileData = {
        email: form.email,
        nickname: form.nickname,
        gender: form.gender as 'MALE' | 'FEMALE',
        housingType: form.housingType as '아파트' | '단독_주택' | '빌라' | '기타',
        contact: form.contact,
        locationId: locationId,
      };

      console.log('프로필 완성 요청 데이터:', profileData);
      console.log('선택된 지역:', form.state, form.district, 'locationId:', locationId);

      const profileResponse = await completeProfile(profileData);
      
      if (profileResponse.profileCompleted) {
        alert("프로필 완성이 완료되었습니다! 서비스를 이용하실 수 있습니다.");
        if (onSuccess) onSuccess();
        setShowProfileModal(false);
        onClose();
      } else {
        alert("프로필 완성에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("프로필 완성 실패:", error);
      alert("프로필 완성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const isFormValid =
    validation.isNicknameAvailable &&
    validation.isEmailAvailable &&
    !!form.gender &&
    !!form.housingType &&
    form.contact.trim() !== '' &&
    !!form.state &&
    !!form.district;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {!showProfileModal ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-orange-700 fill-current" />
                <span className="text-2xl font-handwritten font-bold text-orange-700">Petner</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">로그인</h1>
              <p className="text-neutral-700">펫너에서 새로운 가족을 만나보세요</p>
            </DialogTitle>
          </DialogHeader>
          <Card className="border-neutral-200 shadow-elegant">
            <CardContent className="space-y-4 pt-6">
              <Button variant="kakao" className="w-full h-12 text-base font-medium" onClick={handleKakaoLogin}>
                <img src={kakaoLogo} alt="카카오" className="mr-2 h-5 w-5" />
                카카오로 3초만에 시작하기
              </Button>
            </CardContent>
          </Card>
          <div className="text-center mt-4 text-sm text-neutral-700">
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
                <Label htmlFor="nickname">닉네임</Label>
                <Input id="nickname" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} required />
                <p className={`text-sm mt-1 ${validation.isNicknameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.nicknameMessage}
                </p>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <p className={`text-sm mt-1 ${validation.isEmailAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.emailMessage}
                </p>
              </div>
              <div>
                <Label>성별</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v }) }>
                  <SelectTrigger><SelectValue placeholder="선택하기" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">남성</SelectItem>
                    <SelectItem value="FEMALE">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>주거형태</Label>
                <Select value={form.housingType} onValueChange={(v) => setForm({ ...form, housingType: v }) }>
                  <SelectTrigger><SelectValue placeholder="선택하기" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="아파트">아파트</SelectItem>
                    <SelectItem value="단독_주택">단독주택</SelectItem>
                    <SelectItem value="빌라">빌라</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>연락처</Label>
                <PhoneNumberInput id="contact" value={form.contact} onChange={(value) => setForm({ ...form, contact: value })} />
              </div>
              <div className="md:col-span-2">
                <RegionSelector
                  onRegionChange={handleRegionChange}
                  initialProvince={form.state}
                  initialCity={form.district}
                  showSelectedBox={false}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              {!isProfileCompletionRequired && (
                <Button type="button" variant="outline" onClick={() => setShowProfileModal(false)}>뒤로</Button>
              )}
              <Button type="submit" className="bg-orange-700 hover:bg-orange-700/90 text-white" disabled={!isFormValid}>완료</Button>
            </div>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default LoginModal;
