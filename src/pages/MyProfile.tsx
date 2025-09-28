import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MapPin, Calendar, Camera, Edit, Clock, CheckCircle, FileText, PawPrint, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegionSelector from "@/components/RegionSelector";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { getUserProfile, UserProfile, updateProfile, checkNickname, checkEmail } from "@/api/member";
import { searchLocationByName } from "@/api/location";
import { getMyDogs, DogListResponseDto, updateDog, DogUpdateRequestDto, getDogById, deleteDog } from "@/api/dog";
import { ProtectedImage } from "@/components/ProtectedImage";

// 기본 데이터
const defaultUserData = {
  name: "",
  email: "",
  phone: "",
  regionProvince: "",
  regionCity: "",
  gender: "",
  housingType: "",
  username: "",
  joinDate: "",
  profileImage: "/api/placeholder/150/150",
  locationId: 0
};

const adoptionApplications = [
  {
    id: 1,
    petName: "똥깨",
    petImage: "/src/assets/dog1.jpg",
    status: "입양 처리 중",
    applicationDate: "2024-03-01",
    shelter: "강남 동물보호소"
  },
  {
    id: 2,
    petName: "땅콩이",
    petImage: "/src/assets/dog3.jpg",
    status: "입양 완료",
    applicationDate: "2024-02-15",
    shelter: "서초 동물보호소"
  }
];

const myPosts = [
  {
    id: 1,
    title: "강아지 산책 꿀팁 공유해요!",
    date: "2024-03-05",
    views: 125,
    comments: 8
  },
  {
    id: 2,
    title: "배변훈련 후기",
    date: "2024-02-28",
    views: 89,
    comments: 12
  },
  {
    id: 3,
    title: "반려동물 건강관리 질문",
    date: "2024-02-20",
    views: 67,
    comments: 5
  }
];

const favoritePets = [
  {
    id: 1,
    name: "모카",
    breed: "골든 리트리버",
    age: "2세",
    image: "/src/assets/dog-2.jpg",
    location: "서울 송파구"
  },
  {
    id: 2,
    name: "츄츄",
    breed: "페르시안 고양이",
    age: "1세",
    image: "/src/assets/cat-2.jpg",
    location: "서울 마포구"
  },
  {
    id: 3,
    name: "베리",
    breed: "진돗개",
    age: "3세",
    image: "/src/assets/dog-3.jpg",
    location: "서울 용산구"
  }
];


const adoptionHistory = [
  {
    id: 1,
    petName: "초코",
    breed: "믹스견",
    adoptionDate: "2023-12-10",
    image: "/src/assets/dog-1.jpg"
  },
  {
    id: 2,
    petName: "나비",
    breed: "코리안 숏헤어",
    adoptionDate: "2023-08-15",
    image: "/src/assets/cat-3.jpg"
  }
];

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(defaultUserData);
  const [editData, setEditData] = useState(defaultUserData);
  const [originalData, setOriginalData] = useState(defaultUserData); // 원본 데이터 저장
  const [registrationData, setRegistrationData] = useState<DogListResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validation, setValidation] = useState({
    isNicknameAvailable: true,
    isEmailAvailable: true,
    nicknameChecked: false,
    emailChecked: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; dogId?: number; dogName?: string }>({
    isOpen: false
  });

  // 사용자 프로필 및 내 유기견 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, myDogs] = await Promise.all([
          getUserProfile(),
          getMyDogs()
        ]);

        const transformedData = {
          name: profile.nickname,
          email: profile.email,
          phone: profile.contact,
          regionProvince: profile.state,
          regionCity: profile.district,
          gender: profile.gender.toLowerCase(),
          housingType: profile.housingType,
          username: profile.nickname, // username을 nickname으로 사용
          joinDate: new Date(profile.createdAt).toLocaleDateString('ko-KR'),
          profileImage: "/api/placeholder/150/150",
          locationId: profile.locationId // locationId 추가
        };
        setUserData(transformedData);
        setEditData(transformedData);
        setOriginalData(transformedData); // 원본 데이터 저장

        // 내 유기견 데이터 설정
        setRegistrationData(myDogs);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 닉네임 자동 중복 체크
  useEffect(() => {
    if (isEditing && editData.username && editData.username !== originalData.username) {
      const timer = setTimeout(async () => {
        await handleNicknameCheck(editData.username);
      }, 500); // 500ms 디바운스

      return () => clearTimeout(timer);
    } else if (editData.username === originalData.username) {
      setValidation(prev => ({ ...prev, isNicknameAvailable: true, nicknameChecked: true }));
    }
  }, [editData.username, originalData.username, isEditing]);

  // 이메일 자동 중복 체크
  useEffect(() => {
    if (isEditing && editData.email && editData.email !== originalData.email) {
      const timer = setTimeout(async () => {
        await handleEmailCheck(editData.email);
      }, 500); // 500ms 디바운스

      return () => clearTimeout(timer);
    } else if (editData.email === originalData.email) {
      setValidation(prev => ({ ...prev, isEmailAvailable: true, emailChecked: true }));
    }
  }, [editData.email, originalData.email, isEditing]);

  // 변경 사항 감지
  const hasChanges = () => {
    return (
      editData.username !== originalData.username ||
      editData.email !== originalData.email ||
      editData.phone !== originalData.phone ||
      editData.regionProvince !== originalData.regionProvince ||
      editData.regionCity !== originalData.regionCity ||
      editData.gender !== originalData.gender ||
      editData.housingType !== originalData.housingType
    );
  };

  // 닉네임 중복 체크
  const handleNicknameCheck = async (nickname: string) => {
    if (nickname === originalData.username) {
      setValidation(prev => ({ ...prev, isNicknameAvailable: true, nicknameChecked: true }));
      return;
    }

    try {
      const result = await checkNickname(nickname);
      setValidation(prev => ({
        ...prev,
        isNicknameAvailable: result.available,
        nicknameChecked: true
      }));
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      setValidation(prev => ({ ...prev, isNicknameAvailable: false, nicknameChecked: false }));
    }
  };

  // 이메일 중복 체크
  const handleEmailCheck = async (email: string) => {
    if (email === originalData.email) {
      setValidation(prev => ({ ...prev, isEmailAvailable: true, emailChecked: true }));
      return;
    }

    try {
      const result = await checkEmail(email);
      setValidation(prev => ({
        ...prev,
        isEmailAvailable: result.available,
        emailChecked: true
      }));
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      setValidation(prev => ({ ...prev, isEmailAvailable: false, emailChecked: false }));
    }
  };

  // 프로필 저장
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 지역 정보 API 호출하여 locationId 조회
      let locationId = originalData.locationId;
      if (editData.regionProvince && editData.regionCity) {
        try {
          const locationName = `${editData.regionProvince} ${editData.regionCity}`;
          const locationData = await searchLocationByName(locationName);
          locationId = locationData.locationId;
        } catch (error) {
          console.error('지역 정보 조회 실패:', error);
          alert('지역 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
          return;
        }
      }

      const profileUpdateData = {
        email: editData.email,
        nickname: editData.username,
        gender: editData.gender.toUpperCase() as 'MALE' | 'FEMALE',
        housingType: editData.housingType as '아파트' | '단독_주택' | '빌라' | '기타',
        contact: editData.phone,
        locationId: locationId,
      };

      const updatedProfile = await updateProfile(profileUpdateData);

      // 업데이트된 프로필로 상태 갱신
      const transformedData = {
        name: updatedProfile.nickname,
        email: updatedProfile.email,
        phone: updatedProfile.contact,
        regionProvince: updatedProfile.state,
        regionCity: updatedProfile.district,
        gender: updatedProfile.gender.toLowerCase(),
        housingType: updatedProfile.housingType,
        username: updatedProfile.nickname,
        joinDate: userData.joinDate,
        profileImage: userData.profileImage,
        locationId: updatedProfile.locationId
      };

      setUserData(transformedData);
      setEditData(transformedData);
      setOriginalData(transformedData);
      setIsEditing(false);
      alert('프로필이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  // 편집 취소
  const handleCancel = () => {
    setEditData(originalData);
    setIsEditing(false);
    setValidation({
      isNicknameAvailable: true,
      isEmailAvailable: true,
      nicknameChecked: false,
      emailChecked: false,
    });
  };

  // 저장 버튼 활성화 조건
  const canSave = () => {
    if (!hasChanges()) return false;

    // 닉네임이 변경된 경우에만 중복 체크 완료 여부 확인
    if (editData.username !== originalData.username) {
      if (!validation.nicknameChecked || !validation.isNicknameAvailable) {
        return false;
      }
    }

    // 이메일이 변경된 경우에만 중복 체크 완료 여부 확인
    if (editData.email !== originalData.email) {
      if (!validation.emailChecked || !validation.isEmailAvailable) {
        return false;
      }
    }

    // 모든 필수 필드가 채워져 있는지 확인
    return (
      editData.username.trim() !== '' &&
      editData.email.trim() !== '' &&
      editData.phone.trim() !== '' &&
      editData.regionProvince !== '' &&
      editData.regionCity !== '' &&
      editData.gender !== '' &&
      editData.housingType !== ''
    );
  };

  const handleStatusChange = async (dogId: number, newStatus: string) => {
    try {
      console.log(`강아지 ID ${dogId}의 입양상태를 ${newStatus}로 변경 시도`);

      // 강아지 상세 정보 조회
      const dogDetail = await getDogById(dogId);
      console.log('조회된 강아지 상세 정보:', dogDetail);

      // 전체 필드 DTO 구성
      const fullUpdateData: DogUpdateRequestDto = {
        name: dogDetail.name || null,
        breedId: dogDetail.breed?.breedId || null,
        birthDate: dogDetail.birthDate || null,
        gender: dogDetail.gender || 'MALE',
        dogSize: dogDetail.dogSize || null,
        weight: dogDetail.weight || null,
        healthStatus: dogDetail.healthStatus || null,
        description: dogDetail.description || null,
        adoptionStatus: newStatus,
        imageUrl: dogDetail.imageUrl || null,
        shelterId: dogDetail.shelter?.shelterId || null,
      };

      console.log('🔥 전체 필드 DTO:', fullUpdateData);
      console.log('🔥 전송할 JSON:', JSON.stringify(fullUpdateData, null, 2));

      // 실제 API 호출
      await updateDog(dogId, fullUpdateData);

      // 로컬 상태 업데이트
      setRegistrationData(prev =>
        prev.map(dog =>
          dog.dogId === dogId
            ? { ...dog, adoptionStatus: newStatus }
            : dog
        )
      );

      alert('입양상태가 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('입양상태 변경 실패:', error);
      alert('입양상태 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteClick = (dogId: number, dogName: string) => {
    setDeleteConfirm({
      isOpen: true,
      dogId,
      dogName
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.dogId) return;

    try {
      await deleteDog(deleteConfirm.dogId);

      // 로컬 상태에서 삭제된 강아지 제거
      setRegistrationData(prev =>
        prev.filter(dog => dog.dogId !== deleteConfirm.dogId)
      );

      alert(`${deleteConfirm.dogName}이(가) 성공적으로 삭제되었습니다.`);
    } catch (error) {
      console.error('유기견 삭제 실패:', error);
      alert('유기견 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setDeleteConfirm({ isOpen: false });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "입양_가능":
        return <Badge variant="secondary" className="bg-[#A64F1C]/10 text-[#A64F1C]"><Heart className="w-3 h-3 mr-1" />입양 가능</Badge>;
      case "입양_절차_중":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />입양 절차 중</Badge>;
      case "입양_완료":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />입양 완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
          <div className="text-center">
            <p>프로필 정보를 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
        <div>
          {/* 헤더 */}
          <div className="mb-8 text-center">
            <h2 className="section-heading">내 정보</h2>
            <p className="text-muted-foreground">프로필 정보를 관리하고 나의 반려동물 활동을 확인하세요</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">프로필</TabsTrigger>
              <TabsTrigger value="applications">입양 신청 현황</TabsTrigger>
              <TabsTrigger value="registrations">내가 등록한 유기견</TabsTrigger>
              <TabsTrigger value="posts">내 글</TabsTrigger>
              <TabsTrigger value="favorites">찜 목록</TabsTrigger>
            </TabsList>

            {/* 프로필 관리 */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      프로필 정보
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "취소" : "수정"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData.profileImage} />
                      <AvatarFallback className="text-2xl">
                        {userData.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">아이디 (닉네임)</Label>
                      {isEditing ? (
                        <div>
                          <Input
                            id="username"
                            value={editData.username}
                            onChange={(e) => {
                              setEditData({...editData, username: e.target.value});
                              setValidation(prev => ({ ...prev, nicknameChecked: false }));
                            }}
                          />
                          {editData.username !== originalData.username && validation.nicknameChecked && (
                            <p className={`text-sm mt-1 ${validation.isNicknameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {validation.isNicknameAvailable ? '✓ 사용 가능한 닉네임입니다.' : '✗ 이미 사용중인 닉네임입니다.'}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-foreground">{userData.username}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      {isEditing ? (
                        <div>
                          <Input
                            id="email"
                            type="email"
                            value={editData.email}
                            onChange={(e) => {
                              setEditData({...editData, email: e.target.value});
                              setValidation(prev => ({ ...prev, emailChecked: false }));
                            }}
                          />
                          {editData.email !== originalData.email && validation.emailChecked && (
                            <p className={`text-sm mt-1 ${validation.isEmailAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {validation.isEmailAvailable ? '✓ 사용 가능한 이메일입니다.' : '✗ 이미 사용중인 이메일입니다.'}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-foreground">{userData.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>성별</Label>
                      {isEditing ? (
                        <Select value={editData.gender} onValueChange={(v) => setEditData({...editData, gender: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="성별 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">남성</SelectItem>
                            <SelectItem value="female">여성</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-foreground">{userData.gender === 'male' ? '남성' : '여성'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>주거 형태</Label>
                      {isEditing ? (
                        <Select value={editData.housingType} onValueChange={(v) => setEditData({...editData, housingType: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="주거 형태 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="아파트">아파트</SelectItem>
                            <SelectItem value="단독_주택">단독 주택</SelectItem>
                            <SelectItem value="빌라">빌라</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-foreground">
                          {userData.housingType === '단독_주택' ? '단독 주택' : userData.housingType}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>연락처</Label>
                      {isEditing ? (
                        <PhoneNumberInput
                          id="contact"
                          value={editData.phone}
                          onChange={(value) => setEditData({...editData, phone: value})}
                        />
                      ) : (
                        <p className="text-foreground">{userData.phone}</p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>지역</Label>
                      {isEditing ? (
                        <RegionSelector
                          initialProvince={editData.regionProvince}
                          initialCity={editData.regionCity}
                          showSelectedBox={false}
                          onRegionChange={(province, city) => setEditData({...editData, regionProvince: province, regionCity: city})}
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {userData.regionProvince} {userData.regionCity}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>가입일</Label>
                    <p className="text-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {userData.joinDate}
                    </p>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        disabled={!canSave() || isSaving}
                      >
                        {isSaving ? '저장 중...' : '저장'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        취소
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 입양 신청 현황 */}
            <TabsContent value="applications">
              <Card className="min-h-[70vh] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    입양 신청 현황
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {adoptionApplications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={application.petImage}
                              alt={application.petName}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-foreground">{application.petName}</h3>
                              <p className="text-sm text-muted-foreground">{application.shelter}</p>
                              <p className="text-sm text-muted-foreground">신청일: {application.applicationDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(application.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 빈 공간에 표시될 메시지 */}
                  <div className="flex-1 flex items-start justify-center pt-16">
                    <div className="text-center text-muted-foreground">
                      <PawPrint className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">더 많은 유기견을 입양해주세요.</p>
                      <p className="text-sm mt-2">새로운 가족을 기다리는 아이들이 있습니다.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 내가 등록한 유기견 */}
            <TabsContent value="registrations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    내가 등록한 유기견
                  </CardTitle>
                  <p className="text-sm text-muted-foreground"> 유기견의 정보를 직접 수정할 수 있습니다</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registrationData.map((dog) => (
                      <div key={dog.dogId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <ProtectedImage
                              objectName={dog.imageUrl}
                              alt={dog.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-foreground">{dog.name}</h3>
                              <p className="text-sm text-muted-foreground">{dog.breedName} · {dog.dogSize} · {dog.weight}kg</p>
                              <p className="text-sm text-muted-foreground">등록일: {new Date(dog.createdAt).toLocaleDateString('ko-KR')}</p>
                              <p className="text-sm text-muted-foreground">보호소: {dog.shelterName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              {getStatusBadge(dog.adoptionStatus)}
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => handleDeleteClick(dog.dogId, dog.name)}
                              className="gap-2 text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              삭제
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 고정된 상태 변경 섹션 */}
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-lg font-semibold text-foreground mb-4">등록신청 상태 변경</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {registrationData.map((dog) => (
                        <div key={dog.dogId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <ProtectedImage
                              objectName={dog.imageUrl}
                              alt={dog.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{dog.name}</p>
                              <p className="text-xs text-muted-foreground">{dog.breedName}</p>
                            </div>
                          </div>
                          <Select
                            value={dog.adoptionStatus}
                            onValueChange={(value) => handleStatusChange(dog.dogId, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="입양_가능">입양 가능</SelectItem>
                              <SelectItem value="입양_절차_중">입양 절차 중</SelectItem>
                              <SelectItem value="입양_완료">입양 완료</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 내가 쓴 글 */}
            <TabsContent value="posts">
              <Card className="min-h-[70vh] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    내가 쓴 글
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {myPosts.map((post) => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link to={`/post/${post.id}`} className="font-semibold text-foreground hover:text-primary">
                              {post.title}
                            </Link>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span>{post.date}</span>
                              <span>조회 {post.views}</span>
                              <span>댓글 {post.comments}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="default" size="sm" asChild>
                              <Link to={`/post/${post.id}/edit`}>수정</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/post/${post.id}`}>보기</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 빈 공간에 표시될 메시지 */}
                  <div className="flex-1 flex items-start justify-center pt-16">
                    <div className="text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">더 많은 이야기를 공유해주세요.</p>
                      <p className="text-sm mt-2">반려동물과의 소중한 경험을 나누어보세요.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 관심 반려동물 (찜 목록) */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    관심 반려동물
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoritePets.map((pet) => (
                      <div key={pet.id} className="border rounded-lg p-4">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-full h-48 rounded-lg object-cover mb-4"
                        />
                        <div className="space-y-2">
                          <h3 className="font-semibold text-foreground">{pet.name}</h3>
                          <p className="text-sm text-muted-foreground">{pet.breed} · {pet.age}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {pet.location}
                          </p>
                          <div className="flex space-x-2">
                            <Button size="sm" asChild>
                              <Link to={`/pet/${pet.id}`}>자세히 보기</Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4 text-red-500 fill-current" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* 삭제 확인 모달 */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              유기견 삭제 확인
            </h3>
            <p className="text-muted-foreground mb-6">
              <strong>{deleteConfirm.dogName}</strong>을(를) 정말 삭제하시겠습니까?
              <br />
              삭제된 정보는 복구할 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
              >
                취소
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteConfirm}
                className="gap-2 text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600"
              >
                <Trash2 className="h-4 w-4" />
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;