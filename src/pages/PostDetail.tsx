import { useParams, useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Calendar, ArrowLeft, Eye, User, Edit, Reply, Trash2, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getPost, deletePost, PostResponse } from "@/api/post";
import { ProtectedImage } from "@/components/ProtectedImage";
import { getUserProfile, UserProfile } from "@/api/member";

const commentsData = [
  {
    id: 1,
    author: "동물사랑",
    content: "정말 감동적인 이야기네요! 저도 비슷한 경험이 있어서 공감이 많이 돼요.",
    date: "2024-01-15",
    likes: 5,
    replies: [
      {
        id: 11,
        author: "멍멍이엄마",
        content: "감사합니다! 비슷한 경험이 있으시다니 정말 좋네요. 함께 응원해요!",
        date: "2024-01-15",
        likes: 2,
        parentId: 1,
      },
      {
        id: 12,
        author: "반려동물사랑",
        content: "저도 강아지 입양을 고민 중인데 이런 후기가 정말 도움이 되네요.",
        date: "2024-01-15",
        likes: 1,
        parentId: 1,
      }
    ]
  },
  {
    id: 2,
    author: "보호소봉사자",
    content: "이런 후기를 보면 정말 보람을 느껴요. 끝까지 사랑해주셔서 감사합니다 ❤️",
    date: "2024-01-15",
    likes: 8,
    replies: []
  },
  {
    id: 3,
    author: "입양고민중",
    content: "저도 입양을 고민하고 있는데 많은 도움이 되었어요. 용기를 내보려고 해요!",
    date: "2024-01-16",
    likes: 3,
    replies: [
      {
        id: 31,
        author: "멍멍이엄마",
        content: "입양은 정말 신중하게 결정해야 하는 일이지만, 사랑과 책임감만 있다면 충분히 해낼 수 있어요! 응원합니다!",
        date: "2024-01-16",
        likes: 4,
        parentId: 3,
      }
    ]
  },
];

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // 댓글 관련 상태
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState(commentsData);

  // 좋아요 상태
  const [isLiked, setIsLiked] = useState(false);

  // 현재 사용자 ID (실제로는 로그인 상태에서 가져와야 함)
  const currentUserId = "김철수"; // 실제로는 로그인한 사용자의 ID를 가져와야 함

  // 본인의 게시물인지 확인하는 함수
  const isAuthor = () => {
    return currentUser && post && currentUser.nickname === post.authorNickname;
  };

  // 게시물 수정 페이지로 이동
  const handleEditPost = () => {
    if (isAuthor()) {
      navigate(`/community/edit/${id}`);
    }
  };

  // 게시물 삭제
  const handleDeletePost = async () => {
    if (!isAuthor() || !id) return;

    const confirmDelete = window.confirm("정말로 이 게시물을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deletePost(parseInt(id));
      alert("게시물이 성공적으로 삭제되었습니다.");
      navigate("/community");
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 게시자와 대화하기
  const handleStartChat = () => {
    if (!post || !currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (isAuthor()) {
      alert("본인과는 대화할 수 없습니다.");
      return;
    }

    // TODO: 채팅방 생성 API 호출
    // 현재는 임시로 alert만 표시
    alert(`${post.authorNickname}님과의 채팅방을 생성합니다.`);
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

  // 댓글 추가 함수
  const addComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        author: currentUserId,
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        replies: []
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  // 대댓글 추가 함수
  const addReply = (parentId: number) => {
    if (replyText.trim()) {
      const newReply = {
        id: Date.now(),
        author: currentUserId,
        content: replyText,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        parentId: parentId
      };
      
      setComments(comments.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      ));
      setReplyText("");
      setReplyTo(null);
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
              onClick={() => {
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
              }}
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
          onClick={() => {
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
          }}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로 돌아가기
        </Button>

        {/* Top Border */}
        <div className="border-t-2 border-[var(--color-neutral-900)] mb-0"></div>

        {/* Post Content */}
        <div className="px-20 py-16">
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

          <div className="my-12">
            <div className="border-t border-[var(--color-neutral-200)]"></div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center justify-center gap-6">
            <Button variant="outline" className="gap-2 py-3 px-6 border-gray-400 text-gray-700 hover:bg-primary/10 hover:text-primary hover:border-primary/40">
              <Heart className="h-4 w-4" />
              좋아요
            </Button>
            <Button variant="outline" className="gap-2 py-3 px-6 border-gray-400 text-gray-700 hover:bg-primary/10 hover:text-primary hover:border-primary/40">
              <MessageSquare className="h-4 w-4" />
              댓글 {comments.reduce((total, comment) => total + 1 + comment.replies.length, 0)}
            </Button>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-b-2 border-[var(--color-neutral-900)] mt-0 mb-10"></div>

        {/* Comments Section */}
         <div className="px-20 ">
           <Card className="mx-0">
             <CardHeader className="px-20 pt-12">
               <h2 className="text-xl font-semibold">댓글 {comments.reduce((total, comment) => total + 1 + comment.replies.length, 0)}개</h2>
          </CardHeader>
             <CardContent className="px-20">
            {/* Comment Form */}
            <div className="mb-6">
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
            <div className="space-y-6">
               {comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* Main Comment */}
                  <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {comment.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-foreground mb-3 leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-primary">
                        <Heart className="h-3 w-3 mr-1" />
                        {comment.likes}
                      </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-muted-foreground hover:text-primary"
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          답글
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyTo === comment.id && (
                    <div className="ml-11 border-l-2 border-[var(--color-neutral-200)] pl-4">
                      <Textarea 
                        placeholder={`${comment.author}님에게 답글 달기...`}
                        className="mb-3"
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                       <div className="flex justify-end gap-2">
                         <Button variant="outline" size="sm" onClick={() => {
                           setReplyTo(null);
                           setReplyText("");
                         }}>
                           취소
                         </Button>
                         <Button size="sm" onClick={() => addReply(comment.id)}>
                           답글 작성
                         </Button>
                       </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-11 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Avatar className="h-6 w-6 mt-1">
                            <AvatarFallback className="bg-secondary/10 text-secondary text-xs">
                              {reply.author[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs">{reply.author}</span>
                              <span className="text-xs text-muted-foreground">{reply.date}</span>
                            </div>
                            <p className="text-foreground mb-2 leading-relaxed text-sm">{reply.content}</p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-muted-foreground hover:text-primary">
                                <Heart className="h-3 w-3 mr-1" />
                                {reply.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-muted-foreground hover:text-primary">
                                <Reply className="h-3 w-3 mr-1" />
                        답글
                      </Button>
                    </div>
                  </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
         </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;