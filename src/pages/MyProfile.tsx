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
import { Heart, MapPin, Calendar, Camera, Edit, Clock, CheckCircle, FileText, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegionSelector from "@/components/RegionSelector";
import { getUserProfile, UserProfile } from "@/api/auth";

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
  profileImage: "/api/placeholder/150/150"
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

const registrationApplications = [
  {
    id: 1,
    petName: "멍멍이",
    petImage: "/src/assets/dog1.jpg",
    status: "입양 가능",
    registrationDate: "2024-03-10",
    breed: "골든 리트리버",
    age: "2세"
  },
  {
    id: 2,
    petName: "야옹이",
    petImage: "/src/assets/dog2.jpg",
    status: "입양 완료",
    registrationDate: "2024-02-20",
    breed: "페르시안 고양이",
    age: "1세"
  },
  {
    id: 3,
    petName: "뽀삐",
    petImage: "/src/assets/dog3.jpg",
    status: "반려됨",
    registrationDate: "2024-01-15",
    breed: "비글",
    age: "3세"
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
  const [registrationData, setRegistrationData] = useState(registrationApplications);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 프로필 로드
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        const transformedData = {
          name: profile.nickname,
          email: profile.email,
          phone: profile.contact,
          regionProvince: profile.state,
          regionCity: profile.district,
          gender: profile.gender.toLowerCase(),
          housingType: profile.housingType,
          username: profile.nickname, // username을 nickname으로 사용
          joinDate: "2025-01-15", // 가입일은 별도 API가 필요할 수 있음
          profileImage: "/api/placeholder/150/150"
        };
        setUserData(transformedData);
        setEditData(transformedData);
      } catch (error) {
        console.error('사용자 프로필 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleSave = () => {
    // 실제로는 API 호출
    setIsEditing(false);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setRegistrationData(prev => 
      prev.map(registration => 
        registration.id === id 
          ? { ...registration, status: newStatus }
          : registration
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "입양 가능":
        return <Badge variant="secondary" className="bg-[#A64F1C]/10 text-[#A64F1C]"><Heart className="w-3 h-3 mr-1" />입양 가능</Badge>;
      case "입양 처리 중":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />입양 처리 중</Badge>;
      case "입양 완료":
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
              <TabsTrigger value="registrations">등록 신청 현황</TabsTrigger>
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
                      <Label htmlFor="username">아이디</Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          value={editData.username}
                          onChange={(e) => setEditData({...editData, username: e.target.value})}
                        />
                      ) : (
                        <p className="text-foreground">{userData.username}</p>
                      )}
                    </div>

                    

                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                        />
                      ) : (
                        <p className="text-foreground">{userData.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                        />
                      ) : (
                        <p className="text-foreground">{userData.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">전화번호</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        />
                      ) : (
                        <p className="text-foreground">{userData.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
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
                            <SelectItem value="주택">주택</SelectItem>
                            <SelectItem value="오피스텔">오피스텔</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-foreground">{userData.housingType}</p>
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
                      <Button onClick={handleSave}>저장</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        취소
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 입양 신청 현황 */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    입양 신청 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* 등록 신청 현황 */}
            <TabsContent value="registrations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    등록 신청 현황
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">등록신청 상태를 직접 수정할 수 있습니다</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registrationData.map((registration) => (
                      <div key={registration.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={registration.petImage}
                              alt={registration.petName}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-foreground">{registration.petName}</h3>
                              <p className="text-sm text-muted-foreground">{registration.breed} · {registration.age}</p>
                              <p className="text-sm text-muted-foreground">등록일: {registration.registrationDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(registration.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 고정된 상태 변경 섹션 */}
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-lg font-semibold text-foreground mb-4">등록신청 상태 변경</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {registrationData.map((registration) => (
                        <div key={registration.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img
                              src={registration.petImage}
                              alt={registration.petName}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{registration.petName}</p>
                              <p className="text-xs text-muted-foreground">{registration.breed}</p>
                            </div>
                          </div>
                          <Select 
                            value={registration.status} 
                            onValueChange={(value) => handleStatusChange(registration.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="입양 가능">입양 가능</SelectItem>
                              <SelectItem value="입양 처리 중">입양 처리 중</SelectItem>
                              <SelectItem value="입양 완료">입양 완료</SelectItem>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    내가 쓴 글
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/post/${post.id}`}>보기</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
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
                              <Heart className="h-4 w-4" />
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
    </div>
  );
};

export default MyProfile;