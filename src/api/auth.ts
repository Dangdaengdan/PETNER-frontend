const AUTH_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/kakao`;
const MEMBERS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/members`;

export interface LoginResponse {
  message: string;
  member: {
    memberId: number;
    profileCompleted: boolean;
    email?: string;
    nickname?: string;
    gender?: 'MALE' | 'FEMALE';
    housingType?: '아파트' | '단독_주택' | '빌라' | '기타';
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
  housingType?: '아파트' | '단독_주택' | '빌라' | '기타';
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
  housingType?: '아파트' | '단독_주택' | '빌라' | '기타';
  contact: string;
  state: string;
  district: string;
}

export interface ProfileCompleteRequest {
  nickname: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  housingType: '아파트' | '단독_주택' | '빌라' | '기타';
  contact: string;
  locationId: number;
}

export interface ProfileCompleteResponse {
  memberId: number;
  email: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE';
  housingType?: '아파트' | '단독_주택' | '빌라' | '기타';
  contact: string;
  locationId: number;
  state: string;
  district: string;
  locationName: string;
  profileCompleted: boolean;
}

export interface UserProfile {
  memberId: number;
  email: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE';
  housingType: string;
  contact: string;
  locationId: number;
  state: string;
  district: string;
  locationName: string;
  profileCompleted: boolean;
}

export interface CheckAvailabilityResponse {
  available: boolean;
}

// 카카오 로그인 시작 - 카카오 OAuth 페이지로 리다이렉트
export const initiateKakaoLogin = (): void => {
  window.location.href = `${AUTH_BASE_URL}/login`;
};

// 카카오 콜백 처리 - 인증 코드로 토큰 받기
export const handleKakaoCallback = async (code: string): Promise<LoginResponse> => {
  const response = await fetch(`${AUTH_BASE_URL}/callback?code=${encodeURIComponent(code)}`, {
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
  const response = await fetch(`${AUTH_BASE_URL}/member`, {
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
  const response = await fetch(`${AUTH_BASE_URL}/session`, {
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

// 프로필 완성
export const completeProfile = async (profileData: ProfileCompleteRequest): Promise<ProfileCompleteResponse> => {
  console.log('전송할 프로필 데이터:', JSON.stringify(profileData, null, 2));

  const response = await fetch(`${MEMBERS_BASE_URL}/profile/complete`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    let errorMessage = `프로필 완성 실패: ${response.status}`;
    try {
      const errorData = await response.json();
      console.error('백엔드 에러 응답:', errorData);
      errorMessage += ` - ${JSON.stringify(errorData)}`;
    } catch (e) {
      console.error('에러 응답 파싱 실패:', e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// 사용자 프로필 조회
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch(`${MEMBERS_BASE_URL}/profile`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = `프로필 조회 실패: ${response.status}`;
    try {
      const errorData = await response.json();
      console.error('백엔드 에러 응답:', errorData);
      errorMessage += ` - ${JSON.stringify(errorData)}`;
    } catch (e) {
      console.error('에러 응답 파싱 실패:', e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// 로그아웃
export const kakaoLogout = async (): Promise<LogoutResponse> => {
  const response = await fetch(`${AUTH_BASE_URL}/logout`, {
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

// 닉네임 중복 확인
export const checkNickname = async (nickname: string): Promise<CheckAvailabilityResponse> => {
  const response = await fetch(`${MEMBERS_BASE_URL}/check/nickname?nickname=${encodeURIComponent(nickname)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`닉네임 확인 실패: ${response.status}`);
  }
  return response.json();
};

// 이메일 중복 확인
export const checkEmail = async (email: string): Promise<CheckAvailabilityResponse> => {
  const response = await fetch(`${MEMBERS_BASE_URL}/check/email?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`이메일 확인 실패: ${response.status}`);
  }
  return response.json();
};

