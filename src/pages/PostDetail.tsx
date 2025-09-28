import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Heart, MessageSquare, Calendar, ArrowLeft, Eye, User, Edit, Reply, Trash2, MessageCircle, FileText, Image, Upload, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPost, deletePost, updatePost, PostResponse } from "@/api/post";
import { ProtectedImage } from "@/components/ProtectedImage";
import { getUserProfile, UserProfile } from "@/api/member";
import { uploadImageToGCP } from "@/api/upload";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getComments, createComment, updateComment, deleteComment, CommentResponse, CommentsPageResponse } from "@/api/comment";


const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 댓글 관련 상태
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsPage, setCommentsPage] = useState(0);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [commentsTotalElements, setCommentsTotalElements] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  // 좋아요 상태
  const [isLiked, setIsLiked] = useState(false);

  // 본인의 게시물인지 확인하는 함수
  const isAuthor = () => {
    return currentUser && post && currentUser.nickname === post.authorNickname;
  };

  // Community로 돌아가는 공통 함수
  const navigateToCommunity = () => {
    // Community로 돌아간다는 플래그 설정
    sessionStorage.setItem('fromPostDetail', 'true');

    const savedState = sessionStorage.getItem('communityState');
    if (savedState) {
      const { page, searchTerm, sortBy } = JSON.parse(savedState);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      if (searchTerm) params.set('search', searchTerm);
      if (sortBy && sortBy !== 'latest') params.set('sort', sortBy);
      navigate(`/community?${params.toString()}`);
    } else {
      navigate('/community');
    }
  };

  // 편집 모드 활성화
  const handleEditPost = () => {
    if (isAuthor() && post) {
      setEditTitle(post.title);
      setEditContent(post.content);
      setEditImageFile(null);
      setEditImagePreview(null);
      setIsEditing(true);
    }
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
    setEditImageFile(null);
    setEditImagePreview(null);

    // 게시물 상단으로 스크롤
    setTimeout(() => {
      const postContent = document.querySelector('[data-post-content]');
      if (postContent) {
        postContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // 이미지 변경 핸들러
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setEditImagePreview(url);
    } else {
      setEditImagePreview(null);
    }
  };

  // 게시물 수정 제출
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
      });
      return;
    }

    if (!id) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "잘못된 게시물 ID입니다.",
      });
      return;
    }

    // 수정 사항이 있는지 확인
    const hasChanges =
      editTitle.trim() !== post?.title ||
      editContent.trim() !== post?.content ||
      editImageFile !== null;

    if (!hasChanges) {
      toast({
        title: "알림",
        description: "수정 사항이 없습니다.",
      });
      return;
    }

    setIsUpdating(true);

    try {
      let thumbImageUrl: string | undefined = post?.thumbImageUrl || undefined;

      // 새 이미지가 있으면 업로드
      if (editImageFile) {
        const objectName = await uploadImageToGCP(editImageFile);
        thumbImageUrl = objectName;
      }

      // 게시물 수정
      const postData = {
        title: editTitle.trim(),
        content: editContent.trim(),
        thumbImageUrl,
      };

      const updatedPost = await updatePost(parseInt(id), postData);
      setPost(updatedPost);
      setIsEditing(false);
      toast({
        title: "수정 완료",
        description: "게시물이 성공적으로 수정되었습니다.",
      });

      // 게시물 상단으로 스크롤
      setTimeout(() => {
        const postContent = document.querySelector('[data-post-content]');
        if (postContent) {
          postContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error("게시물 수정 실패:", error);
      toast({
        variant: "destructive",
        title: "수정 실패",
        description: "게시물 수정에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // 게시물 삭제 확인
  const handleDeletePost = () => {
    if (!isAuthor() || !id) return;

    toast({
      title: "게시물 삭제",
      description: "정말로 이 게시물을 삭제하시겠습니까?",
      action: (
        <ToastAction
          altText="삭제"
          onClick={() => confirmDeletePost()}
          className="gap-2 text-red-600 border-red-400 hover:bg-red-600 hover:text-white hover:border-red-600"
        >
          삭제
        </ToastAction>
      ),
    });
  };

  // 실제 삭제 실행
  const confirmDeletePost = async () => {
    if (!id) return;

    try {
      await deletePost(parseInt(id));
      toast({
        title: "삭제 완료",
        description: "게시물이 성공적으로 삭제되었습니다.",
      });
      navigateToCommunity();
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: "게시물 삭제에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  // 게시자와 대화하기
  const handleStartChat = () => {
    if (!post || !currentUser) {
      toast({
        variant: "destructive",
        title: "로그인 필요",
        description: "로그인이 필요합니다.",
      });
      return;
    }

    if (isAuthor()) {
      toast({
        variant: "destructive",
        title: "알림",
        description: "본인과는 대화할 수 없습니다.",
      });
      return;
    }

    // TODO: 채팅방 생성 API 호출
    // 현재는 임시로 toast만 표시
    toast({
      title: "채팅방 생성",
      description: `${post.authorNickname}님과의 채팅방을 생성합니다.`,
    });
    // navigate('/chat/room-id'); // 실제 채팅방 페이지로 이동
  };

  // 페이지 로드 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);

    // Community에서 온 경우 플래그 제거
    const fromCommunity = sessionStorage.getItem('fromCommunity');
    if (fromCommunity) {
      sessionStorage.removeItem('fromCommunity');
    }
  }, []);

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getUserProfile();
        setCurrentUser(userData);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  // API로 게시물 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("잘못된 게시물 ID입니다.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const postData = await getPost(parseInt(id));
        setPost(postData);
        setError(null);
      } catch (error) {
        console.error("게시물 조회 실패:", error);
        setError("게시물을 불러오는데 실패했습니다.");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // URL 쿼리 파라미터로 편집 모드 확인
  useEffect(() => {
    const editParam = searchParams.get('edit');
    console.log('Edit mode check:', {
      editParam,
      hasPost: !!post,
      hasCurrentUser: !!currentUser,
      isAuthor: currentUser && post && currentUser.nickname === post.authorNickname,
      postAuthor: post?.authorNickname,
      currentUserNickname: currentUser?.nickname
    });

    if (editParam === 'true' && post && currentUser && currentUser.nickname === post.authorNickname) {
      console.log('Activating edit mode...');
      // 편집 모드 활성화
      setEditTitle(post.title);
      setEditContent(post.content);
      setEditImageFile(null);
      setEditImagePreview(null);
      setIsEditing(true);

      // URL에서 edit 파라미터 제거 (뒤로 가기 시 다시 편집 모드가 되지 않도록)
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [post, currentUser, searchParams]);

  // 댓글 조회 API (초기 로드)
  const fetchComments = async (page: number = 0, isLoadMore: boolean = false) => {
    if (!id) return;

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setCommentsLoading(true);
    }

    try {
      const commentsData = await getComments(parseInt(id), page, 10, 'createdAt,asc');

      if (isLoadMore) {
        // 무한스크롤: 기존 댓글에 추가
        setComments(prev => [...prev, ...commentsData.content]);
      } else {
        // 초기 로드: 댓글 전체 교체
        setComments(commentsData.content);
      }

      setCommentsTotalPages(commentsData.totalPages);
      setCommentsTotalElements(commentsData.totalElements);
      setCommentsPage(page);
      const hasMore = !commentsData.last && commentsData.content.length > 0;
      setHasMoreComments(hasMore);
      console.log('Updated hasMoreComments:', hasMore, 'isLast:', commentsData.last, 'contentLength:', commentsData.content.length);
    } catch (error) {
      console.error("댓글 조회 실패:", error);
      toast({
        title: "댓글 조회 실패",
        description: "댓글을 불러오는데 실패했습니다.",
      });
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setCommentsLoading(false);
      }
    }
  };

  // 댓글 추가 로드 함수
  const loadMoreComments = async () => {
    console.log('loadMoreComments called:', { hasMoreComments, isLoadingMore, commentsPage });
    if (!hasMoreComments || isLoadingMore) {
      console.log('loadMoreComments blocked:', { hasMoreComments, isLoadingMore });
      return;
    }

    const nextPage = commentsPage + 1;
    console.log('Loading next page:', nextPage);
    await fetchComments(nextPage, true);
  };

  // 게시물 로드 후 댓글 조회
  useEffect(() => {
    if (post && id) {
      fetchComments(0);
    }
  }, [post, id]);

  // 무한스크롤을 위한 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log('Intersection observer triggered:', {
          isIntersecting: target.isIntersecting,
          hasMoreComments,
          isLoadingMore,
          commentsLoading,
          commentsPage
        });

        if (target.isIntersecting && hasMoreComments && !isLoadingMore && !commentsLoading) {
          console.log('Loading more comments...');
          loadMoreComments();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // 약간의 지연을 두고 센티넬을 찾음 (DOM 업데이트 대기)
    const timeoutId = setTimeout(() => {
      const sentinel = document.getElementById('comments-sentinel');
      console.log('Looking for sentinel:', sentinel);
      if (sentinel) {
        observer.observe(sentinel);
        console.log('Sentinel observed');
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const sentinel = document.getElementById('comments-sentinel');
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, [hasMoreComments, isLoadingMore, commentsLoading, comments.length]);

  // 댓글 추가 함수
  const addComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "입력 오류",
        description: "댓글 내용을 입력해주세요.",
      });
      return;
    }

    if (!id) return;

    try {
      await createComment(parseInt(id), { content: newComment.trim() });
      setNewComment("");
      toast({
        title: "댓글 작성 완료",
        description: "댓글이 성공적으로 작성되었습니다.",
      });
      // 댓글 목록 새로고침 (첫 페이지로 이동하여 새 댓글 확인)
      setComments([]);
      setCommentsPage(0);
      setHasMoreComments(true);
      fetchComments(0);
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      toast({
        title: "댓글 작성 실패",
        description: "댓글 작성에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  // 대댓글 추가 함수
  const addReply = async (parentId: number) => {
    if (!replyText.trim()) {
      toast({
        title: "입력 오류",
        description: "답글 내용을 입력해주세요.",
      });
      return;
    }

    if (!id) return;

    try {
      await createComment(parseInt(id), {
        content: replyText.trim(),
        parentCommentId: parentId
      });
      setReplyText("");
      setReplyTo(null);
      toast({
        title: "답글 작성 완료",
        description: "답글이 성공적으로 작성되었습니다.",
      });
      // 댓글 목록 새로고침 (전체 다시 로드)
      setComments([]);
      setCommentsPage(0);
      setHasMoreComments(true);
      fetchComments(0);
    } catch (error) {
      console.error("답글 작성 실패:", error);
      toast({
        title: "답글 작성 실패",
        description: "답글 작성에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  // 댓글 수정 시작
  const startEditComment = (comment: CommentResponse) => {
    setEditingCommentId(comment.commentId);
    setEditCommentText(comment.content);
  };

  // 댓글 수정 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  // 댓글 수정 저장
  const saveEditComment = async (commentId: number) => {
    if (!editCommentText.trim()) {
      toast({
        title: "입력 오류",
        description: "댓글 내용을 입력해주세요.",
      });
      return;
    }

    if (!id) return;

    try {
      await updateComment(parseInt(id), commentId, { content: editCommentText.trim() });
      setEditingCommentId(null);
      setEditCommentText("");
      toast({
        title: "댓글 수정 완료",
        description: "댓글이 성공적으로 수정되었습니다.",
      });
      // 댓글 목록 새로고침 (전체 다시 로드)
      setComments([]);
      setCommentsPage(0);
      setHasMoreComments(true);
      fetchComments(0);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      toast({
        title: "댓글 수정 실패",
        description: "댓글 수정에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!id) return;

    try {
      await deleteComment(parseInt(id), commentId);
      toast({
        title: "댓글 삭제 완료",
        description: "댓글이 성공적으로 삭제되었습니다.",
      });
      // 댓글 목록 새로고침 (전체 다시 로드)
      setComments([]);
      setCommentsPage(0);
      setHasMoreComments(true);
      fetchComments(0);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      toast({
        title: "댓글 삭제 실패",
        description: "댓글 삭제에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">로딩 중...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "게시글을 찾을 수 없습니다"}
            </h1>
            <Button
                variant="ghost"
                onClick={navigateToCommunity}
                className="mb-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            >
              목록으로 돌아가기
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
        {/* Back Button - PetDetail 스타일 */}
        <Button
          variant="ghost"
          onClick={navigateToCommunity}
          className="mb-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로 돌아가기
        </Button>

        {/* Top Border */}
        <div className="border-t-2 border-[var(--color-neutral-900)] mb-0"></div>

        {/* Post Content */}
        <div className="px-20 py-16" data-post-content>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-700)]">
              <User className="h-4 w-4" />
              <span>작성자: {post.authorNickname}</span>
            </div>

            {/* 대화하기 버튼 (본인 게시물이 아닐 때만 표시) */}
            {!isAuthor() && currentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartChat}
                className="gap-2 border-primary/60 text-primary hover:bg-primary/90 hover:text-primary-foreground hover:border-primary/90"
              >
                <MessageCircle className="h-4 w-4" />
                대화하기
              </Button>
            )}
          </div>

          {isEditing ? (
            // 편집 모드
            <form onSubmit={handleSubmitEdit} className="space-y-8">
              {/* 제목 편집 */}
              <div>
                <Label htmlFor="editTitle" className="text-base font-medium mb-3 block">제목 *</Label>
                <Input
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  required
                  className="text-2xl font-bold border-2 border-gray-400 focus:border-primary"
                />
              </div>

              {/* 이미지 편집 */}
              <div>
                <Label htmlFor="editImage" className="text-base font-medium mb-3 block">이미지 변경 (선택)</Label>

                {/* 기존 이미지 표시 */}
                {post.thumbImageUrl && !editImagePreview && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">현재 이미지:</p>
                    <ProtectedImage
                      objectName={post.thumbImageUrl}
                      alt="현재 이미지"
                      className="max-w-full max-h-96 object-contain rounded-lg border"
                    />
                  </div>
                )}

                <Input
                  id="editImage"
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="mb-4 border-2 border-gray-400 focus:border-primary"
                />

                {editImagePreview && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">새 이미지 미리보기:</p>
                    <img
                      src={editImagePreview}
                      alt="preview"
                      className="max-w-full max-h-96 object-contain rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* 내용 편집 */}
              <div>
                <Label htmlFor="editContent" className="text-base font-medium mb-3 block">내용 *</Label>
                <Textarea
                  id="editContent"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={15}
                  required
                  className="text-lg leading-relaxed border-2 border-gray-400 focus:border-primary"
                />
              </div>

              {/* 편집 모드 버튼들 */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="gap-2 text-red-600 border-red-400 hover:bg-red-600 hover:text-white hover:border-red-600"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isUpdating ? "수정 중..." : "수정 완료"}
                </Button>
              </div>
            </form>
          ) : (
            // 읽기 모드
            <>
              <h1 className="text-5xl font-bold text-[var(--color-neutral-900)] mb-12">{post.title}</h1>

              {/* 게시글 메타 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[var(--color-neutral-700)] mb-16">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Eye className="h-4 w-4" />
                  <span>조회 {post.viewCount}</span>
                </div>
              </div>

              {/* 수정/삭제 버튼 (작성자에게만 보임) */}
              {isAuthor() && (
                <div className="flex justify-end gap-2 mb-8">
                  <Button
                    variant="outline"
                    onClick={handleEditPost}
                    className="gap-2 border-primary/60 text-primary hover:bg-primary/90 hover:text-primary-foreground hover:border-primary/90"
                  >
                    <Edit className="h-4 w-4" />
                    수정하기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeletePost}
                    className="gap-2 text-red-600 border-red-400 hover:bg-red-600 hover:text-white hover:border-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    삭제하기
                  </Button>
                </div>
              )}

              {/* 이미지 섹션 */}
              {post.thumbImageUrl && (
                <div className="mb-12">
                  <div className="overflow-hidden bg-gray-100 flex items-center justify-center">
                    <ProtectedImage
                      objectName={post.thumbImageUrl}
                      alt="게시글 이미지"
                      className="max-w-full max-h-96 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* 본문 내용 */}
              <div className="prose prose-lg max-w-none mb-12">
                <div className="whitespace-pre-wrap text-[var(--color-neutral-900)] leading-relaxed text-xl">
                  {post.content}
                </div>
              </div>
            </>
          )}

          {!isEditing && (
            <>
              <div className="my-12">
                <div className="border-t border-[var(--color-neutral-200)]"></div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="outline"
                  className="gap-2 py-3 px-6 border-gray-400 text-gray-700 hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                  onClick={() => {
                    const commentForm = document.querySelector('[data-comment-form]');
                    if (commentForm) {
                      commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      // 댓글 입력창에 포커스
                      setTimeout(() => {
                        const textarea = commentForm.querySelector('textarea');
                        if (textarea) {
                          textarea.focus();
                        }
                      }, 300);
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                  댓글 {commentsTotalElements}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Bottom Border */}
        {!isEditing && <div className="border-b-2 border-[var(--color-neutral-900)] mt-0 mb-10"></div>}

        {/* Comments Section - 편집 모드가 아닐 때만 표시 */}
        {!isEditing && (
         <div className="px-20 ">
           <Card className="mx-0">
             <CardHeader className="px-20 pt-12">
               <h2 className="text-xl font-semibold">댓글 {commentsTotalElements}개</h2>
          </CardHeader>
             <CardContent className="px-20">
            {/* Comment Form */}
            <div className="mb-6" data-comment-form>
              <Textarea
                placeholder="댓글을 작성해주세요..."
                className="mb-3"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                 <Button onClick={addComment}>댓글 작성</Button>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Comments List */}
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">댓글 로딩 중...</div>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {comments.map((comment) => (
                  <div key={comment.commentId} className="space-y-4">
                    {/* Main Comment */}
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {comment.authorNickname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">{comment.authorNickname}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {editingCommentId === comment.commentId ? (
                            <div className="mb-3">
                              <Textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="mb-3"
                                rows={3}
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={cancelEditComment}
                                  className="gap-2 text-red-600 border-red-400 hover:bg-red-600 hover:text-white hover:border-red-600"
                                >
                                  취소
                                </Button>
                                <Button onClick={() => saveEditComment(comment.commentId)}>
                                  저장
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-foreground mb-3 leading-relaxed">{comment.content}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setReplyTo(replyTo === comment.commentId ? null : comment.commentId)}
                                    className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                                >
                                  <Reply className="mr-2 h-4 w-4" />
                                  답글달기
                                </DropdownMenuItem>
                                {(() => {
                                  console.log('Comment debug:', {
                                    commentId: comment.commentId,
                                    authorNickname: comment.authorNickname,
                                    deletedAt: comment.deletedAt,
                                    currentUser: currentUser?.nickname
                                  });
                                  return currentUser && currentUser.nickname === comment.authorNickname && !comment.deletedAt;
                                })() && (
                                    <>
                                      <DropdownMenuItem
                                          onClick={() => startEditComment(comment)}
                                          className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        수정하기
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                          onClick={() => handleDeleteComment(comment.commentId)}
                                          className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        삭제하기
                                      </DropdownMenuItem>
                                    </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    {/* Reply Form */}
                    {replyTo === comment.commentId && (
                      <div className="ml-11 border-l-2 border-[var(--color-neutral-200)] pl-4">
                        <Textarea
                          placeholder={`${comment.authorNickname}님에게 답글 달기...`}
                          className="mb-3"
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setReplyTo(null);
                              setReplyText("");
                            }}
                            className="gap-2 text-red-600 border-red-400 hover:bg-red-600 hover:text-white hover:border-red-600"
                          >
                            취소
                          </Button>
                          <Button size="sm" onClick={() => addReply(comment.commentId)}>
                            답글 작성
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-11 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.commentId} className="flex gap-3">
                            <Avatar className="h-6 w-6 mt-1">
                              <AvatarFallback className="bg-secondary/10 text-secondary text-xs">
                                {reply.authorNickname[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-xs">{reply.authorNickname}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(reply.createdAt).toLocaleDateString()} {new Date(reply.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                {editingCommentId === reply.commentId ? (
                                  <div className="mb-2">
                                    <Textarea
                                      value={editCommentText}
                                      onChange={(e) => setEditCommentText(e.target.value)}
                                      className="mb-3 text-sm"
                                      rows={2}
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={cancelEditComment}
                                        className="gap-2 text-red-600 border-red-400 hover:bg-red-600 hover:text-white hover:border-red-600"
                                      >
                                        취소
                                      </Button>
                                      <Button size="sm" onClick={() => saveEditComment(reply.commentId)}>
                                        저장
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-foreground mb-2 leading-relaxed text-sm">{reply.content}</p>
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => setReplyTo(replyTo === comment.commentId ? null : comment.commentId)}
                                      className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                                    >
                                      <Reply className="mr-2 h-4 w-4" />
                                      답글달기
                                    </DropdownMenuItem>
                                    {currentUser && currentUser.nickname === reply.authorNickname && !reply.deletedAt && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() => startEditComment(reply)}
                                          className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                                        >
                                          <Edit className="mr-2 h-4 w-4" />
                                          수정하기
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDeleteComment(reply.commentId)}
                                          className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          삭제하기
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  ))}
                </div>

                {hasMoreComments && !commentsLoading && comments.length > 0 && (
                  <div
                    id="comments-sentinel"
                    className="h-10 w-full flex items-center justify-center"
                    style={{minHeight: '40px'}}
                  >
                    <div className="text-xs text-muted-foreground">스크롤하여 더 보기...</div>
                  </div>
                )}

                {isLoadingMore && (
                  <div className="flex justify-center py-6">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <div className="text-muted-foreground text-sm">댓글을 더 불러오는 중...</div>
                    </div>
                  </div>
                )}

                {!hasMoreComments && comments.length > 0 && !commentsLoading && (
                  <div className="flex justify-center py-4">
                    <div className="text-muted-foreground text-sm">모든 댓글을 불러왔습니다.</div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
         </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;