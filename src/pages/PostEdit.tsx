import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Image, Upload } from "lucide-react";

// 임시 데이터 (실제로는 API에서 가져와야 함)
const postsData = [
  {
    id: 1,
    title: "강아지 산책 꿀팁 공유해요!",
    content: `강아지 산책할 때 유용한 꿀팁들을 공유해드릴게요!

1. 산책 전 준비사항
- 목줄과 가슴줄 준비
- 물과 간식 준비
- 배변봉투 준비

2. 산책 중 주의사항
- 다른 강아지와의 만남 주의
- 교통사고 주의
- 날씨에 따른 산책 시간 조절

3. 산책 후 관리
- 발가락 사이 청소
- 귀 청소
- 충분한 휴식

이런 팁들이 도움이 되시길 바라요!`,
    images: ["https://images.unsplash.com/photo-1552053831-71594a27632d?w=800"],
    date: "2024-03-05",
    views: 125,
    comments: 8
  },
  {
    id: 2,
    title: "배변훈련 후기",
    content: `우리 강아지 배변훈련 성공했어요!

처음엔 정말 힘들었는데, 꾸준히 하니까 이제 완벽하게 해요.

주요 방법:
- 고정된 시간에 배변장소로 이동
- 성공했을 때 칭찬과 간식
- 실패해도 혼내지 않기
- 인내심 갖고 기다리기

2주 정도 걸렸는데, 이제 아무 문제없어요!`,
    images: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800"],
    date: "2024-02-28",
    views: 89,
    comments: 12
  },
  {
    id: 3,
    title: "반려동물 건강관리 질문",
    content: `우리 고양이가 요즘 많이 먹지 않아서 걱정이에요.

어떤 점들을 체크해봐야 할까요?

- 식욕부진 원인
- 증상별 체크포인트
- 병원 방문 시점
- 예방접종 일정

조언 부탁드려요!`,
    images: [],
    date: "2024-02-20",
    views: 67,
    comments: 5
  }
];

const PostEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 기존 게시글 데이터 로드
  useEffect(() => {
    const post = postsData.find(p => p.id === parseInt(id || '1'));
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      if (post.images && post.images.length > 0) {
        setImagePreview(post.images[0]);
      }
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you'd call your API to update the post.
    console.log({ id, title, content, imageFile });
    navigate(`/post/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-heading">글 수정</h2>
          <p className="text-lg text-muted-foreground">게시글을 수정해 주세요.</p>
        </div>

        {/* Post Edit Form - Big Box Container */}
        <Card className="shadow-lg rounded-3xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Title Section */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  제목
                </h3>
                <div>
                  <Label htmlFor="title" className="text-base font-medium mb-3 block">제목 *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  내용
                </h3>
                <div>
                  <Label htmlFor="content" className="text-base font-medium mb-3 block">내용 *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                    rows={12}
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="border border-border rounded-2xl p-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  이미지 업로드
                </h3>
                <div>
                  <Label htmlFor="image" className="text-base font-medium mb-3 block">이미지 업로드 (선택)</Label>
                  <div className="mt-4">
                    <Input 
                      id="image"
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="mb-6 rounded-xl"
                    />
                    {imagePreview && (
                      <div className="mt-6">
                        <img 
                          src={imagePreview} 
                          alt="preview" 
                          className="w-full h-64 object-cover rounded-xl border border-border" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="w-32 rounded-xl"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                >
                  수정
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <div className="py-16"></div>
      <Footer />
    </div>
  );
};

export default PostEdit;
