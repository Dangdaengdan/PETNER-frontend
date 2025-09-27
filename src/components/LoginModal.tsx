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
import { initiateKakaoLogin, handleKakaoCallback, getCurrentMember, completeProfile, checkNickname, checkEmail } from "@/api/auth";

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
    // Location mapping based on backend database order (starting from 1)
    const locationMapping = [
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

    // Find the locationId (index + 1 since database starts from 1)
    const locationIndex = locationMapping.findIndex(([s, d]) => s === state && d === district);
    const locationId = locationIndex >= 0 ? locationIndex + 1 : 0;

    setForm((prev) => ({ ...prev, state, district, locationId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("입력 양식을 다시 확인해주세요.");
      return;
    }

    try {
      const profileData = {
        email: form.email,
        nickname: form.nickname,
        gender: form.gender as 'MALE' | 'FEMALE',
        housingType: form.housingType as '아파트' | '단독_주택' | '빌라' | '기타',
        contact: form.contact,
        locationId: form.locationId,
      };

      console.log('프로필 완성 요청 데이터:', profileData);
      console.log('선택된 지역:', form.state, form.district, 'locationId:', form.locationId);

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
    !!form.district &&
    form.locationId > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {!showProfileModal ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-primary fill-current" />
                <span className="text-2xl font-handwritten font-bold text-primary">Petner</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">로그인</h1>
              <p className="text-muted-foreground">펫너에서 새로운 가족을 만나보세요</p>
            </DialogTitle>
          </DialogHeader>
          <Card className="border-border shadow-elegant">
            <CardContent className="space-y-4 pt-6">
              <Button variant="kakao" className="w-full h-12 text-base font-medium" onClick={handleKakaoLogin}>
                <img src={kakaoLogo} alt="카카오" className="mr-2 h-5 w-5" />
                카카오로 3초만에 시작하기
              </Button>
            </CardContent>
          </Card>
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
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!isFormValid}>완료</Button>
            </div>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default LoginModal;
