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
import { getPost, updatePost, PostResponse } from "@/api/post";
import { uploadImageToGCP } from "@/api/upload";
import { ProtectedImage } from "@/components/ProtectedImage";

const PostEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시물 데이터 가져오기
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
        setTitle(postData.title);
        setContent(postData.content);
        setExistingImageUrl(postData.thumbImageUrl || null);
        setError(null);
      } catch (error) {
        console.error("게시물 조회 실패:", error);
        setError("게시물을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (!id) {
      alert("잘못된 게시물 ID입니다.");
      return;
    }

    setIsLoading(true);

    try {
      let thumbImageUrl: string | undefined = existingImageUrl || undefined;

      // 새 이미지가 있으면 업로드
      if (imageFile) {
        const objectName = await uploadImageToGCP(imageFile);
        thumbImageUrl = objectName;
      }

      // 게시물 수정
      const postData = {
        title: title.trim(),
        content: content.trim(),
        thumbImageUrl,
      };

      await updatePost(parseInt(id), postData);

      alert("게시물이 성공적으로 수정되었습니다.");
      navigate(`/post/${id}`);
    } catch (error) {
      console.error("게시물 수정 실패:", error);
      alert("게시물 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{error}</h1>
            <Button onClick={() => navigate('/community')}>
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

                  {/* 기존 이미지 표시 */}
                  {existingImageUrl && !imagePreview && (
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-2">현재 이미지:</p>
                      <ProtectedImage
                        objectName={existingImageUrl}
                        alt="현재 이미지"
                        className="w-full h-64 object-cover rounded-xl border border-border"
                      />
                    </div>
                  )}

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
                        <p className="text-sm text-muted-foreground mb-2">새 이미지 미리보기:</p>
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
                  onClick={() => navigate(`/post/${id}`)}
                  className="w-32 rounded-xl"
                  disabled={isLoading}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "수정 중..." : "수정"}
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
