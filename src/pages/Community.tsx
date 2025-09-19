import { useState } from "react";
import { Search, MessageSquare, Heart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const postsData = [
  {
    id: 1,
    title: "우리 강아지 입양 후기 - 3개월차",
    content: "보호소에서 만난 우리 멍멍이와의 3개월 동안의 이야기를 공유하고 싶어요. 처음엔 무서워했는데...",
    author: "멍멍이엄마",
    date: "2024-01-15",
    likes: 24,
    comments: 8,
    category: "입양후기",
  },
  {
    id: 2,
    title: "고양이 입양 전 준비사항 체크리스트",
    content: "처음으로 고양이를 입양하려는 분들을 위한 필수 준비물과 환경 세팅 방법을 정리했습니다.",
    author: "냥이아빠",
    date: "2024-01-14",
    likes: 42,
    comments: 15,
    category: "입양정보",
  },
  {
    id: 3,
    title: "보호소 봉사활동 참여 후기",
    content: "지난 주말 지역 보호소에서 봉사활동을 했습니다. 정말 보람차고 의미있는 시간이었어요.",
    author: "동물사랑이",
    date: "2024-01-13",
    likes: 18,
    comments: 6,
    category: "봉사활동",
  },
  {
    id: 4,
    title: "유기견 임시보호 경험담",
    content: "임시보호를 시작한지 1년이 되어서 그동안의 경험을 나누고 싶습니다. 임시보호를 고민하시는 분들께 도움이 되었으면...",
    author: "임시보호맘",
    date: "2024-01-12",
    likes: 31,
    comments: 12,
    category: "임시보호",
  },
  {
    id: 5,
    title: "반려동물 건강관리 팁",
    content: "수의사가 알려주는 반려동물 일상 건강관리 방법들을 정리해봤습니다.",
    author: "수의사김선생",
    date: "2024-01-11",
    likes: 67,
    comments: 23,
    category: "건강정보",
  },
];

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "입양후기", "입양정보", "봉사활동", "임시보호", "건강정보"];

  const filteredPosts = postsData.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">게시판</h1>
          <p className="text-center text-lg">유기견 입양 및 보호 정보 공유 공간</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="게시글을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/post/${post.id}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{post.author}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">검색 결과가 없습니다</div>
            <p className="text-muted-foreground">다른 검색어나 카테고리를 시도해보세요</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Community;