import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, User } from "lucide-react";
import logo from "@/assets/petner-logo.png";
import { Input } from "@/components/ui/input";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { checkSession, kakaoLogout, getCurrentMember } from "@/api/auth";
import { getUserProfile } from "@/api/member";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [isProfileCompletionRequired, setIsProfileCompletionRequired] = useState(false);
  const [hasShownProfileModal, setHasShownProfileModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 세션 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const sessionResponse = await checkSession();
        if (sessionResponse.authenticated) {
          setIsLoggedIn(true);
          // 세션이 있으면 프로필 완성 상태도 확인
          try {
            const userProfile = await getUserProfile();
            setProfileCompleted(userProfile.profileCompleted);
            if (userProfile.profileCompleted) {
              setHasShownProfileModal(false); // 프로필 완성되면 플래그 리셋
            }
            console.log('프로필 완성 상태:', userProfile.profileCompleted);
          } catch (memberError) {
            console.error('사용자 프로필 조회 실패:', memberError);
            setProfileCompleted(false);
          }
        } else {
          setIsLoggedIn(false);
          setProfileCompleted(false);
        }
      } catch (error) {
        console.error('세션 확인 실패:', error);
        setIsLoggedIn(false);
        setProfileCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 프로필 미완성 사용자가 다른 페이지 접근 시 모달 열기
  useEffect(() => {
    if (!isLoading && isLoggedIn && !profileCompleted && location.pathname !== '/' && !hasShownProfileModal) {
      setIsProfileCompletionRequired(true);
      setIsLoginModalOpen(true);
      setHasShownProfileModal(true);
    }
  }, [isLoggedIn, profileCompleted, location, isLoading, hasShownProfileModal]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await kakaoLogout();
      setIsLoggedIn(false);
      setProfileCompleted(false);
      // 로그아웃 후 즉시 홈으로 리다이렉트
      navigate('/', { replace: true });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 로그아웃 API 실패해도 클라이언트 상태는 초기화하고 홈으로 이동
      setIsLoggedIn(false);
      setProfileCompleted(false);
      navigate('/', { replace: true });
    }
  };

  // 로그인 성공 콜백
  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);

    // 프로필 완성 상태 다시 확인
    try {
      const userProfile = await getUserProfile();
      setProfileCompleted(userProfile.profileCompleted);
      if (userProfile.profileCompleted) {
        setHasShownProfileModal(false); // 프로필 완성되면 플래그 리셋
      }
      console.log('로그인 후 프로필 완성 상태:', userProfile.profileCompleted);
    } catch (error) {
      console.error('로그인 후 멤버 정보 조회 실패:', error);
    }
  };

  const handleLoginClick = () => {
    setIsProfileCompletionRequired(false);
    setIsLoginModalOpen(true);
  };

  // 프로필 미완성 사용자가 다른 서비스 접근 시 LoginModal 열기
  const handleServiceAccess = (e: React.MouseEvent) => {
    if (isLoggedIn && !profileCompleted) {
      e.preventDefault();
      setIsProfileCompletionRequired(true);
      setIsLoginModalOpen(true);
      alert('프로필 완성이 필요합니다. 회원정보를 입력해주세요.');
    } else {
      // 메뉴 클릭 시 페이지 새로고침
      setTimeout(() => window.location.reload(), 100);
    }
  };

  // 메뉴 클릭 시 페이지 새로고침 핸들러
  const handleMenuClick = () => {
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <TooltipProvider>
      <nav className="navbar bg-[#F4EFE4] backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2" onClick={handleMenuClick}>
                <img src={logo} alt="Petner" className="h-8 w-auto" />
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/" end className="navitem" onClick={handleMenuClick}>
                      Home
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>홈</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/register" end className="navitem" onClick={handleServiceAccess}>
                      Register
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>유기견 등록하기</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/community" end className="navitem" onClick={handleServiceAccess}>
                      Community
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>게시판</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/about" end className="navitem" onClick={handleMenuClick}>
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
              <Button className="bg-[#895842] hover:bg-[#453021] text-white" onClick={handleLoginClick}>
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
              <NavLink to="/" end className={({isActive}) => `py-2 px-2 rounded-md transition-smooth ${isActive ? 'bg-[#895842] text-[#F4EFE4]' : 'text-foreground hover:bg-foreground/10'}`} onClick={handleMenuClick}>
                Home
              </NavLink>
              <NavLink to="/register" end className={({isActive}) => `py-2 px-2 rounded-md transition-smooth ${isActive ? 'bg-[#895842] text-[#F4EFE4]' : 'text-foreground hover:bg-foreground/10'}`} onClick={handleServiceAccess}>
                Register
              </NavLink>
              <NavLink to="/community" end className={({isActive}) => `py-2 px-2 rounded-md transition-smooth ${isActive ? 'bg-[#895842] text-[#F4EFE4]' : 'text-foreground hover:bg-foreground/10'}`} onClick={handleServiceAccess}>
                Community
              </NavLink>
              <NavLink to="/about" end className={({isActive}) => `py-2 px-2 rounded-md transition-smooth ${isActive ? 'bg-[#895842] text-[#F4EFE4]' : 'text-foreground hover:bg-foreground/10'}`} onClick={handleMenuClick}>
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
                <Button className="bg-[#A64F1C] hover:bg-[#A64F1C]/90 text-white w-full" onClick={handleLoginClick}>
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
        isProfileCompletionRequired={isProfileCompletionRequired}
      />
    </TooltipProvider>
  );
};

export default Navbar;