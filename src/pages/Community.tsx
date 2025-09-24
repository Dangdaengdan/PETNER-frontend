import { useMemo, useState } from "react";
import { Search, MessageSquare, Heart, Calendar, Eye, Plus } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const postsData = [
  {
    id: 1,
    title: "우리 강아지 입양 후기 - 3개월차",
    content: "보호소에서 만난 우리 멍멍이와의 3개월 동안의 이야기를 공유하고 싶어요. 처음엔 무서워했는데...",
    author: "멍멍이엄마",
    date: "2024-01-15",
    likes: 24,
    comments: 8,
    views: 234,
  },
  {
    id: 2,
    title: "고양이 입양 전 준비사항 체크리스트",
    content: "처음으로 고양이를 입양하려는 분들을 위한 필수 준비물과 환경 세팅 방법을 정리했습니다.",
    author: "냥이아빠",
    date: "2024-01-14",
    likes: 42,
    comments: 15,
    views: 456,
  },
  {
    id: 3,
    title: "보호소 봉사활동 참여 후기",
    content: "지난 주말 지역 보호소에서 봉사활동을 했습니다. 정말 보람차고 의미있는 시간이었어요.",
    author: "동물사랑이",
    date: "2024-01-13",
    likes: 18,
    comments: 6,
    views: 189,
  },
  {
    id: 4,
    title: "유기견 임시보호 경험담",
    content: "임시보호를 시작한지 1년이 되어서 그동안의 경험을 나누고 싶습니다. 임시보호를 고민하시는 분들께 도움이 되었으면...",
    author: "임시보호맘",
    date: "2024-01-12",
    likes: 31,
    comments: 12,
    views: 312,
  },
  {
    id: 5,
    title: "반려동물 건강관리 팁",
    content: "수의사가 알려주는 반려동물 일상 건강관리 방법들을 정리해봤습니다.",
    author: "수의사김선생",
    date: "2024-01-11",
    likes: 67,
    comments: 23,
    views: 567,
  },
];

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("views");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
    { value: "views", label: "조회수 높은순" },
  ];

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = postsData.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort posts based on selected option
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "views":
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, sortBy]);

  const ITEMS_PER_PAGE = 4;
  const currentPage = Math.max(1, Number(params.get("page") || 1));
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedPosts, safePage]);

  const goToPage = (page: number) => {
    navigate(`/community?page=${page}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="page-title mb-2">게시판</h1>
          <p className="text-lg text-muted-foreground">유기견 입양 및 보호 정보 공유 공간</p>
          <div className="flex justify-end mt-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate('/community/new')}>
              <Plus className="h-4 w-4 mr-2" />
              글 작성하기
            </Button>
          </div>
        </div>

        {/* Search Bar (Home style) */}
        <div className="mb-8">
          <div className="w-full max-w-5xl mx-auto rounded-full bg-background border border-border shadow-warm px-2 py-2">
            <div className="flex items-center">
              <div className="flex-1 flex items-center px-4 py-2">
                <Search className="h-5 w-5 text-muted-foreground mr-3" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="게시글을 검색해보세요..."
                  className="h-10 bg-transparent border-0 focus-visible:ring-0 px-0"
                />
              </div>
              <button
                className="ml-2 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-smooth"
                onClick={() => {
                  // Search functionality
                  console.log("Search:", searchTerm);
                }}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sort Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="정렬 기준을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {pageItems.map((post) => (
            <Link 
              key={post.id} 
              to={`/post/${post.id}`}
              className="block"
            >
              <Card className="transition-smooth cursor-pointer shadow-sm hover:-translate-y-1 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>조회 {post.views}</span>
                    </div>
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
        {filteredAndSortedPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">검색 결과가 없습니다</div>
            <p className="text-muted-foreground">다른 검색어를 시도해보세요</p>
          </div>
        )}

        {/* Pagination */}
        {filteredAndSortedPosts.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" onClick={() => goToPage(Math.max(1, safePage - 1))} disabled={safePage <= 1}>{"<"}</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === safePage ? "default" : "outline"}
                onClick={() => goToPage(page)}
                className={page === safePage ? "bg-primary text-primary-foreground" : ""}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" onClick={() => goToPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages}>{">"}</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Community;