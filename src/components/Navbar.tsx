import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, User } from "lucide-react";
import logo from "@/assets/petner-logo.png";
import { Input } from "@/components/ui/input";
import { Link, NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { checkSession, kakaoLogout } from "@/api/auth";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 세션 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const sessionResponse = await checkSession();
        setIsLoggedIn(sessionResponse.authenticated);
      } catch (error) {
        console.error('세션 확인 실패:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await kakaoLogout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // 로그인 성공 콜백
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  return (
    <TooltipProvider>
      <nav className="navbar bg-[#F4EFE4] backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <img src={logo} alt="Petner" className="h-8 w-auto" />
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/" end className="navitem">
                      Home
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>홈</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/register" end className="navitem">
                      Register
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>유기견 등록하기</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/community" end className="navitem">
                      Community
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>게시판</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/about" end className="navitem">
                      About
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>소개</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-[#F4EFE4] text-[#453021] hover:bg-[#A29770] border border-[#453021]" asChild>
              <Link to="/profile">
                <User className="h-5 w-5 mr-2" />
                내 정보
              </Link>
            </Button>
            {isLoading ? (
              <Button disabled className="bg-gray-400 text-white">
                로딩중...
              </Button>
            ) : isLoggedIn ? (
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleLogout}>
                로그아웃
              </Button>
            ) : (
              <Button className="bg-[#895842] hover:bg-[#453021] text-white" onClick={() => setIsLoginModalOpen(true)}>
                로그인/회원가입
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pets..."
                  className="pl-10 bg-background border-border"
                />
              </div>
              <NavLink to="/" end className={({isActive}) => `py-2 px-2 rounded-md transition-smooth ${isActive ? 'bg-[#895842] text-[#F4EFE4]' : 'text-foreground hover:bg-foreground/10'}`}>
                Home
              </NavLink>
              <NavLink to="/register" end className={({isActive}) => `py-2 px-2 rounded-md transition-smooth ${isActive ? 'bg-[#895842] text-[#F4EFE4]' : 'text-foreground hover:bg-foreground/10'}`}>
                Register
              </NavLink>
              <NavLink to="/community" end className={({isActive}) => `py-2 px-2 rounded-md transition-smooth ${isActive ? 'bg-[#895842] text-[#F4EFE4]' : 'text-foreground hover:bg-foreground/10'}`}>
                Community
              </NavLink>
              <NavLink to="/about" end className={({isActive}) => `py-2 px-2 rounded-md transition-smooth ${isActive ? 'bg-[#895842] text-[#F4EFE4]' : 'text-foreground hover:bg-foreground/10'}`}>
                About
              </NavLink>
              <Button className="bg-[#895842] hover:bg-[#895842]/90 text-white w-full" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5 mr-2" />
                  내 정보
                </Link>
              </Button>
              {isLoading ? (
                <Button disabled className="bg-gray-400 text-white w-full">
                  로딩중...
                </Button>
              ) : isLoggedIn ? (
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full" onClick={handleLogout}>
                  로그아웃
                </Button>
              ) : (
                <Button className="bg-[#A64F1C] hover:bg-[#A64F1C]/90 text-white w-full" onClick={() => setIsLoginModalOpen(true)}>
                  로그인/회원가입
                </Button>
              )}
            </div>
          </div>
        )}
        </div>
      </nav>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </TooltipProvider>
  );
};

export default Navbar;