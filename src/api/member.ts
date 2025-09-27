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

// 프로필 수정
export const updateProfile = async (profileData: ProfileUpdateRequest): Promise<ProfileUpdateResponse> => {
  console.log('전송할 프로필 수정 데이터:', JSON.stringify(profileData, null, 2));

  const response = await fetch(`${MEMBERS_BASE_URL}/profile`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    let errorMessage = `프로필 수정 실패: ${response.status}`;
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