import { useMemo, useState } from "react";
import { Search, MessageSquare, Heart, Calendar, Eye, Plus } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  {
    id: 6,
    title: "강아지 훈련 방법 - 기본 명령어",
    content: "새로 입양한 강아지와 함께 살아가기 위한 기본적인 훈련 방법과 명령어를 소개합니다.",
    author: "훈련사박씨",
    date: "2024-01-10",
    likes: 35,
    comments: 18,
    views: 423,
  },
  {
    id: 7,
    title: "고양이 스트레스 해소법",
    content: "고양이가 스트레스를 받을 때 나타나는 증상과 해소 방법에 대해 알아보세요.",
    author: "고양이심리학자",
    date: "2024-01-09",
    likes: 28,
    comments: 11,
    views: 345,
  },
  {
    id: 8,
    title: "반려동물 응급처치 가이드",
    content: "반려동물에게 응급상황이 발생했을 때 할 수 있는 기본적인 응급처치 방법을 정리했습니다.",
    author: "응급의학과",
    date: "2024-01-08",
    likes: 89,
    comments: 34,
    views: 678,
  },
  {
    id: 9,
    title: "강아지 산책 시 주의사항",
    content: "안전하고 즐거운 산책을 위한 필수 체크리스트와 주의해야 할 점들을 알려드립니다.",
    author: "산책러버",
    date: "2024-01-07",
    likes: 45,
    comments: 16,
    views: 512,
  },
  {
    id: 10,
    title: "고양이 화장실 훈련 완벽 가이드",
    content: "새로 입양한 고양이의 화장실 훈련을 위한 단계별 방법과 팁을 공유합니다.",
    author: "고양이맘",
    date: "2024-01-06",
    likes: 52,
    comments: 22,
    views: 489,
  },
  {
    id: 11,
    title: "반려동물 식단 관리의 중요성",
    content: "반려동물의 건강한 식단 구성과 영양 균형에 대해 수의사가 직접 설명합니다.",
    author: "영양사최선생",
    date: "2024-01-05",
    likes: 73,
    comments: 29,
    views: 634,
  },
  {
    id: 12,
    title: "강아지 사회화 훈련 방법",
    content: "강아지가 다른 동물이나 사람들과 잘 어울릴 수 있도록 하는 사회화 훈련의 중요성과 방법을 알아보세요.",
    author: "사회화전문가",
    date: "2024-01-04",
    likes: 41,
    comments: 19,
    views: 456,
  },
  {
    id: 13,
    title: "고양이 놀이와 상호작용",
    content: "고양이와 더 즐겁게 놀 수 있는 방법과 올바른 상호작용 방법을 소개합니다.",
    author: "고양이행동학자",
    date: "2024-01-03",
    likes: 38,
    comments: 14,
    views: 398,
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

  const ITEMS_PER_PAGE = 15;
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
      
      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="section-heading">게시판</h2>
          <p className="text-lg text-muted-foreground">유기견 입양 및 보호 정보 공유 공간</p>
        </div>

        {/* Search Bar (Home style) */}
        <div className="mb-10 md:mb-12">
          <div className="w-full max-w-3xl mx-auto rounded-full bg-background border border-border shadow-warm px-2 py-2">
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

        {/* Sort Filter + Create Button Row */}
        <div className="mb-10 md:mb-12">
          <div className="flex items-center justify-between gap-4">
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

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate('/community/new')}>
              <Plus className="h-4 w-4 mr-2" />
              글 작성하기
            </Button>
          </div>
        </div>

        {/* Posts List - Table Format */}
        {/* Total Count */}
        <div className="mb-4">
          <span className="text-[var(--color-neutral-700)]">
            총 <span className="text-[#007bff] font-semibold">{filteredAndSortedPosts.length}</span> 건의 글이 있습니다.
          </span>
        </div>

        {/* Top Border */}
        <div className="border-t-2 border-[var(--color-neutral-900)] mb-0"></div>

        {/* Table Header */}
        <div className="px-6 py-4 bg-[#f8f9fa] border-b border-[var(--color-neutral-200)]">
          <div className="grid grid-cols-12 gap-4 text-base font-medium text-[var(--color-neutral-900)]">
            <div className="col-span-1">NO</div>
            <div className="col-span-2">작성자</div>
            <div className="col-span-5">제목</div>
            <div className="col-span-2 text-right">조회수</div>
            <div className="col-span-2 text-right">작성일</div>
          </div>
        </div>

        <div className="border-t-2 border-[var(--color-neutral-900)] mb-0"></div>

        {/* Table Body */}
        <div className="divide-y divide-[var(--color-neutral-200)]">
          {pageItems.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/post/${post.id}`}
              className="block hover:bg-gray-50 transition-colors"
            >
              <div className="px-6 py-4">
                <div className="grid grid-cols-12 gap-4 text-base items-center">
                  <div className="col-span-1 text-[var(--color-neutral-700)]">
                    {filteredAndSortedPosts.length - (safePage - 1) * ITEMS_PER_PAGE - index}
                  </div>
                  <div className="col-span-2 text-[var(--color-neutral-700)]">
                    {post.author}
                  </div>
                  <div className="col-span-5 text-[var(--color-neutral-900)]">
                    {post.title}
                  </div>
                  <div className="col-span-2 text-right text-[var(--color-neutral-700)]">
                    {post.views}
                  </div>
                  <div className="col-span-2 text-right text-[var(--color-neutral-700)]">
                    {post.date}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Border */}
        <div className="border-b-2 border-[var(--color-neutral-900)] mt-0"></div>

        {/* Empty State */}
        {filteredAndSortedPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">검색 결과가 없습니다</div>
            <p className="text-muted-foreground">다른 검색어를 시도해보세요</p>
          </div>
        )}

        {/* Pagination */}
        {filteredAndSortedPosts.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
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