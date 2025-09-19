import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Building2, Mail, Phone, MessageCircle } from "lucide-react";

const About = () => {
  const stats = [
    { number: "500+", label: "성공한 입양" },
    { number: "50+", label: "협력 보호소" },
    { number: "2,000+", label: "활성 유저" },
    { number: "95%", label: "입양 만족도" }
  ];

  const team = [
    { name: "김철수", role: "대표", description: "동물보호 활동 10년 경력" },
    { name: "이영희", role: "개발팀장", description: "펫테크 전문 개발자" },
    { name: "박민수", role: "디자이너", description: "UX/UI 디자인 전문가" },
    { name: "정수연", role: "보호소 매니저", description: "전국 보호소 네트워크 관리" }
  ];

  const partners = [
    "서울동물보호센터", "경기도동물보호협회", "부산유기견보호소", 
    "대구반려동물센터", "인천동물사랑협회", "광주펫케어센터"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            유기견에게 
            <span className="text-primary block">새로운 가족을</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            데이터 기반 매칭으로 반려동물과 가족을 연결하는 
            새로운 입양 플랫폼입니다.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        
        {/* 서비스 소개 */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">서비스 소개</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  기획 배경
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  매년 수만 마리의 유기견이 보호소에서 새로운 가족을 기다리고 있습니다. 
                  하지만 정보 부족과 매칭 시스템의 한계로 많은 동물들이 기회를 얻지 못하고 있습니다. 
                  우리는 이 문제를 해결하고자 데이터 기반의 스마트한 입양 매칭 서비스를 만들었습니다.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  추구하는 가치
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">책임감 있는 입양</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">데이터 기반 매칭</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">보호소 네트워크 연결</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">커뮤니티 기반 지원</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 미션 & 비전 */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-12">미션 & 비전</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl">미션</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  "유기견에게 두 번째 기회를 주고,<br />
                  사람에게는 평생의 반려를 선물한다"
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-2xl">비전</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  "반려동물과 사람이<br />
                  더 행복하게 살아가는 사회"
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 성과 & 임팩트 */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">우리의 성과</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 팀 소개 */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">팀 소개</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 파트너 & 협력 기관 */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">협력 기관</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                전국 보호소 파트너십
              </CardTitle>
              <CardDescription>
                신뢰할 수 있는 보호소들과 함께 안전한 입양 서비스를 제공합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {partners.map((partner, index) => (
                  <div key={index} className="p-4 border rounded-lg text-center">
                    <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-medium">{partner}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 연락처 */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">연락처</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>이메일</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">contact@petadopt.com</p>
                <p className="text-muted-foreground">support@petadopt.com</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>전화</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">02-1234-5678</p>
                <p className="text-sm text-muted-foreground">평일 9시-18시</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>카카오톡</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">@펫입양매칭</p>
                <p className="text-sm text-muted-foreground">24시간 상담 가능</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;