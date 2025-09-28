import { useMemo, useState, useEffect } from "react";
import { Search, MessageSquare, Heart, Calendar, Eye, Plus } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPosts, searchPosts, PostSummaryResponse } from "@/api/post";

const Community = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // URL 파라미터에서 초기값 설정
  const [searchTerm, setSearchTerm] = useState(params.get("search") || "");
  const [sortBy, setSortBy] = useState(params.get("sort") || "latest");
  const [posts, setPosts] = useState<PostSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [isRestoringScroll, setIsRestoringScroll] = useState(true);

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
    { value: "views", label: "조회수 높은순" },
  ];

  // 페이지 관련 계산
  const ITEMS_PER_PAGE = 10;
  const currentPage = Math.max(1, Number(params.get("page") || 1));

  // sessionStorage에 상태 저장 (스크롤 위치 포함)
  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 복원 중이면 저장하지 않음
      if (isRestoringScroll) {
        return;
      }

      const currentScrollY = window.scrollY;
      const currentState = {
        page: currentPage,
        searchTerm,
        sortBy,
        scrollY: currentScrollY
      };
      sessionStorage.setItem('communityState', JSON.stringify(currentState));
    };

    // 스크롤 이벤트 등록
    window.addEventListener('scroll', handleScroll);

    // 초기 저장 시 기존 스크롤 위치 유지
    const savedState = sessionStorage.getItem('communityState');
    let savedScrollY = 0;

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        savedScrollY = parsed.scrollY || 0;
      } catch (e) {
        console.error('저장된 상태 파싱 실패:', e);
      }
    }

    const currentState = {
      page: currentPage,
      searchTerm,
      sortBy,
      scrollY: savedScrollY // 기존 스크롤 위치 유지
    };
    sessionStorage.setItem('communityState', JSON.stringify(currentState));

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage, searchTerm, sortBy, isRestoringScroll]);

  // 게시글 링크 클릭 시 현재 스크롤 위치 저장
  const handlePostClick = () => {
    const currentScrollY = window.scrollY;
    const currentState = {
      page: currentPage,
      searchTerm,
      sortBy,
      scrollY: currentScrollY
    };
    sessionStorage.setItem('communityState', JSON.stringify(currentState));
    sessionStorage.setItem('fromCommunity', 'true');
  };

  // 페이지 로드 시 초기 스크롤 위치 설정 (깜빡임 방지)
  useEffect(() => {
    const fromPostDetail = sessionStorage.getItem('fromPostDetail');
    const savedState = sessionStorage.getItem('communityState');

    if (fromPostDetail && savedState) {
      try {
        const { scrollY } = JSON.parse(savedState);
        if (scrollY) {
          // 페이지 로드 즉시 스크롤 위치 설정 (깜빡임 방지)
          window.scrollTo({ top: scrollY, behavior: 'instant' });
        }
      } catch (error) {
        console.error('초기 스크롤 설정 실패:', error);
      }
    }
  }, []); // 페이지 로드 시 한 번만 실행

  // PostDetail에서 돌아온 경우 스크롤 위치 복원
  useEffect(() => {
    const fromPostDetail = sessionStorage.getItem('fromPostDetail');
    const savedState = sessionStorage.getItem('communityState');

    if (fromPostDetail && savedState && !loading) {
      // 로딩이 완료된 후에만 스크롤 복원
      try {
        const { scrollY } = JSON.parse(savedState);

        if (scrollY) {
          // 콘텐츠 로딩 완료 후 스크롤 복원
          sessionStorage.removeItem('fromPostDetail');

          // DOM 업데이트 후 스크롤 복원
          setTimeout(() => {
            window.scrollTo({ top: scrollY, behavior: 'instant' });

            // 복원 완료 후 플래그 해제
            setTimeout(() => {
              setIsRestoringScroll(false);
            }, 100);
          }, 50);
        } else {
          // scrollY가 없으면 바로 플래그 해제
          setIsRestoringScroll(false);
        }
      } catch (error) {
        console.error('스크롤 복원 실패:', error);
        sessionStorage.removeItem('fromPostDetail');
        setIsRestoringScroll(false);
      }
    } else if (!fromPostDetail) {
      // PostDetail에서 온 것이 아니면 바로 플래그 해제
      setIsRestoringScroll(false);
    }
    // loading이 true일 때는 아무것도 하지 않고 기다림
  }, [loading, posts]);

  // API 호출
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (searchTerm.trim()) {
          // 검색이 있는 경우 searchPosts 사용
          const searchResults = await searchPosts(searchTerm, sortBy, currentPage - 1, ITEMS_PER_PAGE);
          setPosts(searchResults);
          setTotalElements(searchResults.length);
        } else {
          // 일반 목록 조회
          const sortParam = sortBy === "latest" ? "createdAt,desc" :
                           sortBy === "oldest" ? "createdAt,asc" :
                           "viewCount,desc";

          const response = await getPosts(currentPage - 1, ITEMS_PER_PAGE, sortParam);
          setPosts(response.content);
          setTotalElements(response.totalElements);
        }
      } catch (error) {
        console.error("게시물 조회 실패:", error);
        setPosts([]);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, sortBy, currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalElements / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

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
                  placeholder="게시글을 검색해보세요... (2글자 이상 입력해주세요.)"
                  className="h-10 bg-transparent border-0 focus-visible:ring-0 px-0"
                />
              </div>
              <button
                className="ml-2 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-smooth"
                onClick={() => {
                  // 페이지를 1로 리셋하고 검색 수행
                  navigate("/community?page=1");
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
            총 <span className="text-[#007bff] font-semibold">{totalElements}</span> 건의 글이 있습니다.
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
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">로딩 중...</div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-neutral-200)]">
            {posts.map((post, index) => (
              <Link
                key={post.postId}
                to={`/post/${post.postId}`}
                className="block hover:bg-gray-50 transition-colors"
                onClick={handlePostClick}
              >
                <div className="px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 text-base items-center">
                    <div className="col-span-1 text-[var(--color-neutral-700)]">
                      {totalElements - (safePage - 1) * ITEMS_PER_PAGE - index}
                    </div>
                    <div className="col-span-2 text-[var(--color-neutral-700)] truncate">
                      {post.authorNickname}
                    </div>
                    <div className="col-span-5 text-[var(--color-neutral-900)] truncate">
                      <span className="hover:text-primary transition-colors" title={post.title}>
                        {post.title}
                      </span>
                    </div>
                    <div className="col-span-2 text-right text-[var(--color-neutral-700)]">
                      {post.viewCount}
                    </div>
                    <div className="col-span-2 text-right text-[var(--color-neutral-700)]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Border */}
        <div className="border-b-2 border-[var(--color-neutral-900)] mt-0"></div>

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {searchTerm ? "검색 결과가 없습니다" : "등록된 게시물이 없습니다"}
            </div>
            <p className="text-muted-foreground">
              {searchTerm ? "다른 검색어를 시도해보세요" : "첫 번째 게시물을 작성해보세요"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && posts.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
            <Button
              variant="outline"
              onClick={() => goToPage(Math.max(1, safePage - 1))}
              disabled={safePage <= 1}
              className="hover:bg-primary/10 hover:text-primary"
            >
              {"<"}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === safePage ? "default" : "outline"}
                onClick={() => goToPage(page)}
                className={page === safePage ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage >= totalPages}
              className="hover:bg-primary/10 hover:text-primary"
            >
              {">"}
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Community;