import axios from 'axios';

const MEMBERS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/members`;

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
  housingType?: '아파트' | '단독_주택' | '빌라' | '기타';
  contact: string;
  locationId: number;
  state: string;
  district: string;
  locationName: string;
  createdAt: string;
  profileCompleted: boolean;
}

export interface CheckAvailabilityResponse {
  available: boolean;
}

export interface ProfileUpdateRequest {
  email: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE';
  housingType: '아파트' | '단독_주택' | '빌라' | '기타';
  contact: string;
  locationId: number;
}

export interface ProfileUpdateResponse {
  memberId: number;
  email: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE';
  housingType: '아파트' | '단독_주택' | '빌라' | '기타';
  contact: string;
  locationId: number;
  state: string;
  district: string;
  locationName: string;
  profileCompleted: boolean;
}

// 프로필 완성
export const completeProfile = async (profileData: ProfileCompleteRequest): Promise<ProfileCompleteResponse> => {
  console.log('전송할 프로필 데이터:', JSON.stringify(profileData, null, 2));

  try {
    const response = await axios.post(`${MEMBERS_BASE_URL}/profile/complete`, profileData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    let errorMessage = `프로필 완성 실패`;
    if (axios.isAxiosError(error)) {
      errorMessage += `: ${error.response?.status}`;
      if (error.response?.data) {
        console.error('백엔드 에러 응답:', error.response.data);
        errorMessage += ` - ${JSON.stringify(error.response.data)}`;
      }
    } else {
      console.error('에러 응답 파싱 실패:', error);
    }
    throw new Error(errorMessage);
  }
};

// 사용자 프로필 조회
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axios.get(`${MEMBERS_BASE_URL}/profile`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    let errorMessage = `프로필 조회 실패`;
    if (axios.isAxiosError(error)) {
      errorMessage += `: ${error.response?.status}`;
      if (error.response?.data) {
        console.error('백엔드 에러 응답:', error.response.data);
        errorMessage += ` - ${JSON.stringify(error.response.data)}`;
      }
    } else {
      console.error('에러 응답 파싱 실패:', error);
    }
    throw new Error(errorMessage);
  }
};

// 닉네임 중복 확인
export const checkNickname = async (nickname: string): Promise<CheckAvailabilityResponse> => {
  try {
    const response = await axios.get(`${MEMBERS_BASE_URL}/check/nickname?nickname=${encodeURIComponent(nickname)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`닉네임 확인 실패: ${error.response?.status}`);
    }
    throw error;
  }
};

// 이메일 중복 확인
export const checkEmail = async (email: string): Promise<CheckAvailabilityResponse> => {
  try {
    const response = await axios.get(`${MEMBERS_BASE_URL}/check/email?email=${encodeURIComponent(email)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`이메일 확인 실패: ${error.response?.status}`);
    }
    throw error;
  }
};

// 프로필 수정
export const updateProfile = async (profileData: ProfileUpdateRequest): Promise<ProfileUpdateResponse> => {
  console.log('전송할 프로필 수정 데이터:', JSON.stringify(profileData, null, 2));

  try {
    const response = await axios.patch(`${MEMBERS_BASE_URL}/profile`, profileData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    let errorMessage = `프로필 수정 실패`;
    if (axios.isAxiosError(error)) {
      errorMessage += `: ${error.response?.status}`;
      if (error.response?.data) {
        console.error('백엔드 에러 응답:', error.response.data);
        errorMessage += ` - ${JSON.stringify(error.response.data)}`;
      }
    } else {
      console.error('에러 응답 파싱 실패:', error);
    }
    throw new Error(errorMessage);
  }
};