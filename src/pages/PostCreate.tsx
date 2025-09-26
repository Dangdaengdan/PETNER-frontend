import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Image, Upload } from "lucide-react";

const PostCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    // Here you'd call your API to create the post.
    console.log({ title, content, imageFile });
    navigate("/community");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48 py-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-heading">새 글 작성</h2>
          <p className="text-lg text-muted-foreground">유기동물 입양 후기나 도움이 필요한 고민을 자유롭게 작성해 주세요.</p>
        </div>

        {/* Post Creation Form - Big Box Container */}
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
                  등록
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

export default PostCreate;


