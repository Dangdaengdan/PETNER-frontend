import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <span className="text-2xl font-handwritten font-bold text-primary">
              Petner
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">로그인</h1>
          <p className="text-muted-foreground">펫너에서 새로운 가족을 만나보세요</p>
        </div>

        <Card className="border-border shadow-elegant">
          <CardContent className="space-y-4 pt-6">
            {/* Social Login */}
            <Button 
              variant="outline" 
              className="w-full h-12 text-base border-border hover:bg-accent"
            >
              <Mail className="mr-2 h-5 w-5" />
              카카오로 3초만에 시작하기
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>로그인하면 Petner의 서비스 약관 및 개인정보 보호정책에 동의하게 됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;