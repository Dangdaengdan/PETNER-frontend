import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('KakaoCallback 페이지 로드됨');

    // 카카오 콜백 파라미터를 홈으로 전달
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    console.log('KakaoCallback - success:', success, 'error:', error);
    console.log('KakaoCallback - 전체 URL:', window.location.href);

    // 즉시 홈으로 리다이렉트
    if (success || error) {
      // 파라미터를 유지하면서 홈으로 리다이렉트
      const params = new URLSearchParams();
      if (success) params.set('success', success);
      if (error) params.set('error', error);

      const redirectUrl = `/?${params.toString()}`;
      console.log('KakaoCallback - 홈으로 리다이렉트:', redirectUrl);

      // 강제 리다이렉트
      setTimeout(() => {
        navigate(redirectUrl, { replace: true });
      }, 100);
    } else {
      // 파라미터가 없으면 그냥 홈으로
      console.log('KakaoCallback - 파라미터 없음, 홈으로 이동');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    }
  }, []);

  // 컴포넌트가 마운트되자마자 리다이렉트
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success || error) {
      const params = new URLSearchParams();
      if (success) params.set('success', success);
      if (error) params.set('error', error);
      window.location.replace(`/?${params.toString()}`);
    } else {
      window.location.replace('/');
    }
  }, []);

  // 로딩 표시
  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-100 to-brown-400 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default KakaoCallback;