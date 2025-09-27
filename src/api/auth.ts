const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/kakao`;

export interface LoginResponse {
  message: string;
  member: {
    memberId: number;
    profileCompleted: boolean;
    email?: string;
    nickname?: string;
    gender?: 'MALE' | 'FEMALE';
    housingType?: 'APARTMENT' | 'HOUSE' | 'MULTI' | 'STUDIO' | 'ETC';
    contact?: string;
    locationId?: number;
    state?: string;
    district?: string;
    locationName?: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface SessionResponse {
  authenticated: boolean;
  status: string;
}

export interface MemberResponse {
  memberId: number;
  email?: string;
  nickname?: string;
  gender?: 'MALE' | 'FEMALE';
  housingType?: 'APARTMENT' | 'HOUSE' | 'MULTI' | 'STUDIO' | 'ETC';
  contact?: string;
  locationId?: number;
  state?: string;
  district?: string;
  locationName?: string;
  profileCompleted: boolean;
}

export interface UserProfileData {
  nickname: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  housingType: 'APARTMENT' | 'HOUSE' | 'MULTI' | 'STUDIO' | 'ETC';
  contact: string;
  state: string;
  district: string;
}

// 카카오 로그인 시작 - 카카오 OAuth 페이지로 리다이렉트
export const initiateKakaoLogin = (): void => {
  window.location.href = `${BASE_URL}/login`;
};

// 카카오 콜백 처리 - 인증 코드로 토큰 받기
export const handleKakaoCallback = async (code: string): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/callback?code=${encodeURIComponent(code)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`카카오 콜백 처리 실패: ${response.status}`);
  }

  return response.json();
};

// 현재 로그인된 사용자 정보 조회
export const getCurrentMember = async (): Promise<MemberResponse> => {
  const response = await fetch(`${BASE_URL}/member`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`사용자 정보 조회 실패: ${response.status}`);
  }

  return response.json();
};

// 세션 상태 확인
export const checkSession = async (): Promise<SessionResponse> => {
  const response = await fetch(`${BASE_URL}/session`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`세션 확인 실패: ${response.status}`);
  }

  return response.json();
};

// 로그아웃
export const kakaoLogout = async (): Promise<LogoutResponse> => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`로그아웃 실패: ${response.status}`);
  }

  return response.json();
};

