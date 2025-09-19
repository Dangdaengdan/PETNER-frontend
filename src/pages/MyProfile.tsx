import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Calendar, Camera, Edit, Clock, CheckCircle, FileText, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 임시 데이터
const userData = {
  name: "Cardi B",
  email: "offset@email.com",
  phone: "010-1234-5678",
  location: "서울 강남구",
  joinDate: "2025-01-15",
  profileImage: "/api/placeholder/150/150"
};

const adoptionApplications = [
  {
    id: 1,
    petName: "똥깨",
    petImage: "/src/assets/dog1.jpg",
    status: "심사중",
    applicationDate: "2024-03-01",
    shelter: "강남 동물보호소"
  },
  {
    id: 2,
    petName: "땅콩이",
    petImage: "/src/assets/dog3.jpg",
    status: "승인됨",
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
  const [editData, setEditData] = useState(userData);

  const handleSave = () => {
    // 실제로는 API 호출
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "심사중":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />심사중</Badge>;
      case "승인됨":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />승인됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">내 정보</h1>
            <p className="text-muted-foreground">프로필 정보를 관리하고 나의 반려동물 활동을 확인하세요</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">프로필</TabsTrigger>
              <TabsTrigger value="applications">입양신청</TabsTrigger>
              <TabsTrigger value="posts">내 글</TabsTrigger>
              <TabsTrigger value="favorites">찜 목록</TabsTrigger>
              <TabsTrigger value="history">입양완료</TabsTrigger>
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
                    {isEditing && (
                      <Button variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        사진 변경
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Label htmlFor="location">위치</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={editData.location}
                          onChange={(e) => setEditData({...editData, location: e.target.value})}
                        />
                      ) : (
                        <p className="text-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {userData.location}
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

            {/* 입양 완료 기록 */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5" />
                    입양 완료 기록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adoptionHistory.map((adoption) => (
                      <div key={adoption.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={adoption.image}
                            alt={adoption.petName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-foreground">{adoption.petName}</h3>
                            <p className="text-sm text-muted-foreground">{adoption.breed}</p>
                            <p className="text-sm text-muted-foreground">입양일: {adoption.adoptionDate}</p>
                          </div>
                          <div className="ml-auto">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              입양완료
                            </Badge>
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