import { useParams, useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Calendar, ArrowLeft, Eye, User, Edit, Reply } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const postsData = [
  {
    id: 1,
    title: "우리 강아지 입양 후기 - 3개월차",
    content: `보호소에서 만난 우리 멍멍이와의 3개월 동안의 이야기를 공유하고 싶어요. 

처음엔 무서워했는데 지금은 정말 가족이 되었답니다. 보호소에서 처음 만났을 때 구석에 웅크리고 있던 모습이 아직도 생생해요. 직원분이 말씀하시길 2개월 넘게 입양을 못 간 아이라고 하시더라고요.

첫 주는 정말 힘들었어요. 밤새 울어서 잠을 못 잤고, 밥도 잘 안 먹고, 산책도 무서워했어요. 수의사선생님과 상담도 받고, 온라인에서 정보도 많이 찾아보면서 천천히 적응시켜 나갔어요.

2주차부터 조금씩 변화가 보이기 시작했어요. 제 목소리에 반응하고, 간식을 손에서 받아먹기 시작했죠. 한 달이 지나니 꼬리를 흔들며 반겨주기 시작했고, 지금은 제가 퇴근하면 문 앞에서 기다리고 있어요.

혹시 입양을 고민하고 계시는 분들이 있다면, 처음엔 힘들어도 꼭 끝까지 포기하지 마세요. 시간과 인내심이 필요하지만, 그만큼 큰 사랑을 받을 수 있어요.`,
    author: "멍멍이엄마",
    date: "2024-01-15",
    createdAt: "2024-01-15 14:30:25",
    updatedAt: "2024-01-15 14:30:25",
    likes: 24,
    comments: 8,
    views: 234,
    category: "입양후기",
    images: ["https://images.unsplash.com/photo-1552053831-71594a27632d?w=800", "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800"],
  },
  {
    id: 2,
    title: "고양이 입양 전 준비사항 체크리스트",
    content: `처음으로 고양이를 입양하려는 분들을 위한 필수 준비물과 환경 세팅 방법을 정리했습니다.

## 필수 준비물
1. 고양이 화장실과 모래
2. 밥그릇과 물그릇
3. 스크래처 (갈고리 발톱 관리용)
4. 캐리어 (병원 방문시 필요)
5. 고양이 침대나 이불

## 환경 세팅
- 안전한 공간 확보
- 독성 식물 제거
- 전선이나 위험한 물건 정리
- 높은 곳에 올라갈 수 있는 공간 마련

입양 전 충분한 준비를 통해 고양이와 함께 행복한 시간을 보내세요!`,
    author: "냥이아빠",
    date: "2024-01-14",
    createdAt: "2024-01-14 09:15:42",
    updatedAt: "2024-01-14 16:22:18",
    likes: 42,
    comments: 15,
    views: 456,
    category: "게시글",
    images: ["https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800"],
  },
  {
    id: 3,
    title: "보호소 봉사활동 참여 후기",
    content: `지난 주말 지역 보호소에서 봉사활동을 했습니다. 정말 보람차고 의미있는 시간이었어요.

아침 8시에 보호소에 도착해서 강아지들의 산책과 청소를 도왔습니다. 처음엔 무서워했던 아이들도 시간이 지나면서 친해져서 정말 뿌듯했어요.

특히 눈이 안 좋은 할머니 강아지가 있었는데, 제가 산책을 도와드리니까 정말 좋아하시더라고요. 이런 작은 도움이지만 동물들에게는 큰 도움이 되는 것 같아요.

앞으로도 정기적으로 봉사활동에 참여하려고 합니다. 관심 있으신 분들도 함께해요!`,
    author: "동물사랑이",
    date: "2024-01-13",
    createdAt: "2024-01-13 19:45:12",
    updatedAt: "2024-01-13 19:45:12",
    likes: 18,
    comments: 6,
    views: 189,
    category: "봉사활동",
    images: [],
  },
];

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
  const post = postsData.find(p => p.id === parseInt(id || '1'));
  
  // 댓글 관련 상태
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState(commentsData);
  
  // 좋아요 상태
  const [isLiked, setIsLiked] = useState(false);
  
  // 현재 사용자 ID (실제로는 로그인 상태에서 가져와야 함)
  const currentUserId = "김철수"; // 실제로는 로그인한 사용자의 ID를 가져와야 함

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

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">게시글을 찾을 수 없습니다</h1>
            <Button onClick={() => navigate('/community')}>목록으로 돌아가기</Button>
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
          onClick={() => navigate('/community')}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>

        {/* Top Border */}
        <div className="border-t-2 border-[var(--color-neutral-900)] mb-0"></div>

        {/* Post Content */}
        <div className="px-20 py-16">
          <div className="flex items-center justify-between mb-12">
              <Badge variant="secondary">{post.category}</Badge>
            <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-700)]">
              <User className="h-4 w-4" />
              <span>작성자 ID: {post.author}</span>
            </div>
            </div>
          
          <h1 className="text-5xl font-bold text-[var(--color-neutral-900)] mb-12">{post.title}</h1>
          
          {/* 게시글 메타 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[var(--color-neutral-700)] mb-16">
                <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>{post.createdAt}</span>
                </div>
            <div className="flex items-center justify-end gap-2">
              <Eye className="h-4 w-4" />
              <span>조회 {post.views}</span>
                </div>
              </div>

          {/* 이미지 섹션 */}
          {post.images && post.images.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 gap-6">
                {post.images.map((image, index) => (
                  <div key={index} className="overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={image}
                      alt={`게시글 이미지 ${index + 1}`}
                      className="max-w-full max-h-96 object-contain"
                    />
                </div>
                ))}
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
            <Button variant="outline" className="gap-2 py-3 px-6">
                <Heart className="h-4 w-4" />
                좋아요 {post.likes}
              </Button>
            <Button variant="outline" className="gap-2 py-3 px-6">
              <MessageSquare className="h-4 w-4" />
              댓글 {post.comments}
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