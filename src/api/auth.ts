import axios from 'axios';
import { MemberResponse } from './member';

const AUTH_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/kakao`;

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

// 카카오 로그인 시작 - 카카오 OAuth 페이지로 리다이렉트
export const initiateKakaoLogin = (): void => {
  window.location.href = `${AUTH_BASE_URL}/login`;
};

// 카카오 콜백 처리 - 인증 코드로 토큰 받기
export const handleKakaoCallback = async (code: string): Promise<LoginResponse> => {
  try {
    const response = await axios.get(`${AUTH_BASE_URL}/callback?code=${encodeURIComponent(code)}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`카카오 콜백 처리 실패: ${error.response?.status}`);
    }
    throw error;
  }
};

// 현재 로그인된 사용자 정보 조회
export const getCurrentMember = async (): Promise<MemberResponse> => {
  try {
    const response = await axios.get(`${AUTH_BASE_URL}/member`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`사용자 정보 조회 실패: ${error.response?.status}`);
    }
    throw error;
  }
};

// 세션 상태 확인
export const checkSession = async (): Promise<SessionResponse> => {
  try {
    const response = await axios.get(`${AUTH_BASE_URL}/session`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`세션 확인 실패: ${error.response?.status}`);
    }
    throw error;
  }
};

// 로그아웃
export const kakaoLogout = async (): Promise<LogoutResponse> => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/logout`, {}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`로그아웃 실패: ${error.response?.status}`);
    }
    throw error;
  }
};