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
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegionSelector from "@/components/RegionSelector";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { getUserProfile, UserProfile, updateProfile, checkNickname, checkEmail } from "@/api/member";
import { searchLocationByName } from "@/api/location";
import { getMyDogs, DogListResponseDto, updateDog, DogUpdateRequestDto, getDogById, deleteDog } from "@/api/dog";
import { getMyPosts, PostSummaryResponse } from "@/api/post";
import { getMyDogApplies, getReceivedDogApplies, processDogApply, deleteDogApply, MyDogApplyResponse, ReceivedDogApplyResponse } from "@/api/dogapply";
import { getMyFavorites, FavoriteResponse, removeFavorite } from "@/api/favorite";
import { ProtectedImage } from "@/components/ProtectedImage";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'profile';
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(defaultUserData);
  const [editData, setEditData] = useState(defaultUserData);
  const [originalData, setOriginalData] = useState(defaultUserData); // 원본 데이터 저장
  const [registrationData, setRegistrationData] = useState<DogListResponseDto[]>([]);
  const [myApplications, setMyApplications] = useState<MyDogApplyResponse[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<ReceivedDogApplyResponse[]>([]);
  const [myPosts, setMyPosts] = useState<PostSummaryResponse[]>([]);
  const [favoritePets, setFavoritePets] = useState<FavoriteResponse[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsPage, setPostsPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validation, setValidation] = useState({
    isNicknameAvailable: true,
    isEmailAvailable: true,
    nicknameChecked: false,
    emailChecked: false,
  });

  // 사용자 프로필 및 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, myDogs, myApplies, receivedApplies, favorites] = await Promise.all([
          getUserProfile(),
          getMyDogs(),
          getMyDogApplies(),
          getReceivedDogApplies(),
          getMyFavorites().catch(() => []) // 에러 시 빈 배열 반환
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
        // 입양 신청 데이터 설정
        setMyApplications(myApplies);
        setReceivedApplications(receivedApplies);

        // 찜목록 데이터 설정
        setFavoritePets(favorites);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 탭 변경 함수
  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  // 찜목록에서 제거 함수
  const handleRemoveFavorite = async (dogId: number) => {
    try {
      await removeFavorite(dogId);
      // 성공적으로 제거되면 state에서도 제거
      setFavoritePets(prev => prev.filter(fav => fav.dogInfo.dogId !== dogId));
      toast({
        title: "찜목록에서 제거되었습니다",
        description: "관심 반려동물에서 성공적으로 제거되었습니다.",
      });
    } catch (error) {
      console.error('찜목록 제거 실패:', error);
      toast({
        title: "제거 실패",
        description: "찜목록 제거에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  // 내 게시물 로드 함수
  const loadMyPosts = async (page: number = 0, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setIsLoadingMorePosts(true);
    } else {
      setPostsLoading(true);
    }

    try {
      const postsData = await getMyPosts(page, 10, 'createdAt,desc');

      if (isLoadMore) {
        // 무한스크롤: 기존 게시물에 추가
        setMyPosts(prev => [...prev, ...postsData.content]);
      } else {
        // 초기 로드: 게시물 전체 교체
        setMyPosts(postsData.content);
      }

      setPostsPage(page);
      setHasMorePosts(!postsData.last);
    } catch (error) {
      console.error('내 게시물 로드 실패:', error);
      if (!isLoadMore) {
        setMyPosts([]);
      }
    } finally {
      if (isLoadMore) {
        setIsLoadingMorePosts(false);
      } else {
        setPostsLoading(false);
      }
    }
  };

  // 더 많은 게시물 로드
  const loadMorePosts = async () => {
    if (!hasMorePosts || isLoadingMorePosts) return;

    const nextPage = postsPage + 1;
    await loadMyPosts(nextPage, true);
  };

  // 무한스크롤을 위한 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMorePosts && !isLoadingMorePosts && !postsLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const timeoutId = setTimeout(() => {
      const sentinel = document.getElementById('posts-sentinel');
      if (sentinel) {
        observer.observe(sentinel);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const sentinel = document.getElementById('posts-sentinel');
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, [hasMorePosts, isLoadingMorePosts, postsLoading, myPosts.length]);

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
          toast({
            title: "지역 정보 로드 실패",
            description: "지역 정보를 불러오는데 실패했습니다. 다시 시도해주세요.",
          });
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
      toast({
        title: "프로필 수정 완료",
        description: "프로필이 성공적으로 수정되었습니다.",
      });
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      toast({
        title: "프로필 수정 실패",
        description: "프로필 수정에 실패했습니다. 다시 시도해주세요.",
      });
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

      toast({
        title: "입양상태 변경 완료",
        description: "입양상태가 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      console.error('입양상태 변경 실패:', error);
      toast({
        title: "입양상태 변경 실패",
        description: "입양상태 변경에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  // 입양 신청 처리 (승인/거절)
  const handleApplicationProcess = async (dogApplyId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await processDogApply(dogApplyId, { status });

      // 승인된 경우 해당 유기견의 상태를 "입양_절차_중"으로 변경
      if (status === 'APPROVED') {
        const application = receivedApplications.find(app => app.dogApplyId === dogApplyId);
        if (application) {
          try {
            // 강아지 상세 정보 조회
            const dogDetail = await getDogById(application.dogId);

            // 전체 필드 DTO 구성하여 입양 상태만 변경
            const fullUpdateData: DogUpdateRequestDto = {
              name: dogDetail.name || null,
              breedId: dogDetail.breed?.breedId || null,
              birthDate: dogDetail.birthDate || null,
              gender: dogDetail.gender || 'MALE',
              dogSize: dogDetail.dogSize || null,
              weight: dogDetail.weight || null,
              healthStatus: dogDetail.healthStatus || null,
              description: dogDetail.description || null,
              adoptionStatus: "입양_절차_중",
              imageUrl: dogDetail.imageUrl || null,
              shelterId: dogDetail.shelter?.shelterId || null,
            };

            await updateDog(application.dogId, fullUpdateData);

            // 내가 등록한 유기견 목록에서도 상태 업데이트
            setRegistrationData(prev =>
              prev.map(dog =>
                dog.dogId === application.dogId
                  ? { ...dog, adoptionStatus: "입양_절차_중" }
                  : dog
              )
            );
          } catch (dogUpdateError) {
            console.error('유기견 상태 업데이트 실패:', dogUpdateError);
            // 유기견 상태 업데이트가 실패해도 입양 신청 처리는 성공했으므로 계속 진행
          }
        }
      }

      // 로컬 상태 업데이트
      setReceivedApplications(prev =>
        prev.map(app =>
          app.dogApplyId === dogApplyId
            ? { ...app, status, processedAt: new Date().toISOString() }
            : app
        )
      );

      toast({
        title: `입양 신청이 ${status === 'APPROVED' ? '승인' : '거절'}되었습니다`,
        description: `${status === 'APPROVED' ? '해당 유기견의 상태가 "입양 절차 중"으로 변경되었습니다.' : ''}`,
      });
    } catch (error) {
      console.error('입양 신청 처리 실패:', error);
      toast({
        title: '입양 신청 처리 실패',
        description: '입양 신청 처리에 실패했습니다. 다시 시도해주세요.',
      });
    }
  };

  // 내 입양 신청 삭제
  const handleMyApplicationDelete = async (dogApplyId: number) => {
    if (!window.confirm('정말로 이 입양 신청을 취소하시겠습니까?')) {
      return;
    }

    try {
      await deleteDogApply(dogApplyId);

      // 로컬 상태에서 삭제
      setMyApplications(prev =>
        prev.filter(app => app.dogApplyId !== dogApplyId)
      );

      toast({
        title: '입양 신청 취소',
        description: '입양 신청이 취소되었습니다.',
      });
    } catch (error) {
      console.error('입양 신청 취소 실패:', error);
      toast({
        title: '입양 신청 취소 실패',
        description: '입양 신청 취소에 실패했습니다. 다시 시도해주세요.',
      });
    }
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

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />대기 중</Badge>;
      case "APPROVED":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />승인됨</Badge>;
      case "REJECTED":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><CheckCircle className="w-3 h-3 mr-1" />거절됨</Badge>;
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

          <Tabs value={currentTab} className="space-y-6" onValueChange={(value) => {
            handleTabChange(value);
            // posts 탭이 클릭될 때 내 게시물 로드
            if (value === 'posts' && !postsLoading) {
              loadMyPosts();
            }
          }}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">프로필</TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">입양 신청 현황</TabsTrigger>
              <TabsTrigger value="registrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">내가 등록한 유기견</TabsTrigger>
              <TabsTrigger value="posts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">내 글</TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">찜 목록</TabsTrigger>
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
              <div className="space-y-6">
                {/* 내가 요청한 입양 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      내가 요청한 입양
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">내가 신청한 입양 신청 목록입니다</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myApplications.length > 0 ? (
                        myApplications.map((application) => (
                          <div key={application.dogApplyId} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <ProtectedImage
                                  objectName={application.dogImageUrl}
                                  alt={application.dogName}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                  <h3 className="font-semibold text-foreground">{application.dogName}</h3>
                                  <p className="text-sm text-muted-foreground">{application.breedName} · {application.location}</p>
                                  <p className="text-sm text-muted-foreground">신청일: {new Date(application.createdAt).toLocaleDateString('ko-KR')}</p>
                                  <p className="text-sm text-muted-foreground">상대방: {application.counterpartNickname}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  {getApplicationStatusBadge(application.status)}
                                </div>
                                {application.status === 'PENDING' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMyApplicationDelete(application.dogApplyId)}
                                    className="text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600"
                                  >
                                    취소
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <PawPrint className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">아직 신청한 입양이 없습니다</p>
                          <p className="text-sm mt-2">새로운 가족을 기다리는 아이들을 찾아보세요</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 받은 입양 신청 요청 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      받은 입양 신청 요청
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">내 유기견에 대한 입양 신청을 승인하거나 거절할 수 있습니다</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {receivedApplications.length > 0 ? (
                        receivedApplications.map((application) => (
                          <div key={application.dogApplyId} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <ProtectedImage
                                  objectName={application.dogImageUrl}
                                  alt={application.dogName}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                  <h3 className="font-semibold text-foreground">{application.dogName}</h3>
                                  <p className="text-sm text-muted-foreground">{application.breedName} · {application.location}</p>
                                  <p className="text-sm text-muted-foreground">신청일: {new Date(application.createdAt).toLocaleDateString('ko-KR')}</p>
                                  <p className="text-sm text-muted-foreground">신청자: {application.counterpartNickname}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  {getApplicationStatusBadge(application.status)}
                                </div>
                                {application.status === 'PENDING' && (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApplicationProcess(application.dogApplyId, 'APPROVED')}
                                      className="text-green-600 border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600"
                                    >
                                      승인
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApplicationProcess(application.dogApplyId, 'REJECTED')}
                                      className="text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600"
                                    >
                                      거절
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <PawPrint className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">아직 받은 입양 신청이 없습니다</p>
                          <p className="text-sm mt-2">내 유기견에 관심을 두는 사람들이 나타날 것입니다</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                          <div className="text-right">
                            {getStatusBadge(dog.adoptionStatus)}
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
                  {postsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-muted-foreground">내 게시물 로딩 중...</div>
                    </div>
                  ) : (
                    <div className="space-y-4 flex-1">
                      {myPosts.length > 0 ? (
                        myPosts.map((post) => (
                          <div key={post.postId} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0 mr-4">
                                <Link to={`/post/${post.postId}`} className="font-semibold text-foreground hover:text-primary block">
                                  <span className="truncate block" title={post.title}>
                                    {post.title}
                                  </span>
                                </Link>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                  <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                                  <span>조회 {post.viewCount}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => {
                                    // React Router의 navigate 사용하여 쿼리 파라미터와 함께 이동
                                    navigate(`/post/${post.postId}?edit=true`);
                                  }}
                                >
                                  수정
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/post/${post.postId}`}>보기</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          작성한 게시글이 없습니다.
                        </div>
                      )}

                      {/* 무한스크롤을 위한 센티넬 요소 */}
                      {myPosts.length > 0 && hasMorePosts && (
                        <div id="posts-sentinel" className="h-4"></div>
                      )}

                      {/* 더 많은 게시물 로딩 중 표시 */}
                      {isLoadingMorePosts && (
                        <div className="text-center py-4">
                          <div className="text-muted-foreground text-sm">더 많은 게시물 로딩 중...</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 게시물이 없을 때만 표시되는 빈 공간 메시지 */}
                  {!postsLoading && myPosts.length === 0 && (
                    <div className="flex-1 flex items-start justify-center pt-16">
                      <div className="text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">더 많은 이야기를 공유해주세요.</p>
                        <p className="text-sm mt-2">반려동물과의 소중한 경험을 나누어보세요.</p>
                      </div>
                    </div>
                  )}
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
                  {favoritePets.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">관심 반려동물이 없습니다.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoritePets.map((favorite) => (
                        <div key={favorite.favoriteId} className="border rounded-lg p-4">
                          {favorite.dogInfo.imageUrl ? (
                            <ProtectedImage
                              objectName={favorite.dogInfo.imageUrl}
                              alt={favorite.dogInfo.name}
                              className="w-full h-48 rounded-lg object-cover mb-4"
                            />
                          ) : (
                            <div className="w-full h-48 rounded-lg bg-gray-200 flex items-center justify-center mb-4">
                              <span className="text-gray-500">이미지 없음</span>
                            </div>
                          )}
                          <div className="space-y-2">
                            <h3 className="font-semibold text-foreground">{favorite.dogInfo.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {favorite.dogInfo.breedName} · {favorite.dogInfo.dogSize} · {favorite.dogInfo.gender === 'MALE' ? '수컷' : '암컷'}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {favorite.dogInfo.shelterName || "보호소 정보 없음"}
                            </p>
                            <div className="flex space-x-2">
                              <Button size="sm" asChild>
                                <Link to={`/pet/${favorite.dogInfo.dogId}?from=profile&tab=favorites`}>자세히 보기</Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveFavorite(favorite.dogInfo.dogId)}
                              >
                                <Heart className="h-4 w-4 text-red-500 fill-current" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyProfile;