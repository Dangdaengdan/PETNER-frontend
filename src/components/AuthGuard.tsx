import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkSession } from '@/api/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const sessionResponse = await checkSession();
        if (sessionResponse.authenticated) {
          setIsAuthenticated(true);
        } else {
          // 세션이 없으면 홈으로 리다이렉트
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // API 호출 실패 시에도 홈으로 리다이렉트
        navigate('/', { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    verifySession();
  }, [navigate, location.pathname]);

  // 세션 체크 중일 때는 로딩 표시
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">로그인 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 인증된 경우에만 자식 컴포넌트 렌더링
  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;