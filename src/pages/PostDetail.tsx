import { useParams, Link } from "react-router-dom";
import { Heart, MessageSquare, Calendar, ChevronLeft, User } from "lucide-react";
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
];

const commentsData = [
  {
    id: 1,
    author: "동물사랑",
    content: "정말 감동적인 이야기네요! 저도 비슷한 경험이 있어서 공감이 많이 돼요.",
    date: "2024-01-15",
    likes: 5,
  },
  {
    id: 2,
    author: "보호소봉사자",
    content: "이런 후기를 보면 정말 보람을 느껴요. 끝까지 사랑해주셔서 감사합니다 ❤️",
    date: "2024-01-15",
    likes: 8,
  },
  {
    id: 3,
    author: "입양고민중",
    content: "저도 입양을 고민하고 있는데 많은 도움이 되었어요. 용기를 내보려고 해요!",
    date: "2024-01-16",
    likes: 3,
  },
];

const PostDetail = () => {
  const { id } = useParams();
  const post = postsData.find(p => p.id === parseInt(id || '1'));

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/community" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            목록으로 돌아가기
          </Link>
        </div>

        {/* Post Content */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{post.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {post.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{post.author}</span>
                </div>
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
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4" />
                좋아요 {post.likes}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">댓글 {commentsData.length}개</h2>
          </CardHeader>
          <CardContent>
            {/* Comment Form */}
            <div className="mb-6">
              <Textarea 
                placeholder="댓글을 작성해주세요..."
                className="mb-3"
                rows={3}
              />
              <div className="flex justify-end">
                <Button>댓글 작성</Button>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Comments List */}
            <div className="space-y-6">
              {commentsData.map((comment) => (
                <div key={comment.id} className="flex gap-3">
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
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-primary">
                        답글
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;