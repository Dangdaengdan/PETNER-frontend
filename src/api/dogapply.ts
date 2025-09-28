import axios from 'axios';

const DOG_APPLIES_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/dog-applies`;

// 분양 신청 상태 타입
export type ApplyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// 1. 분양 신청 생성 요청/응답 타입
export interface DogApplyCreateRequest {
  dogId: number;
}

export interface DogApplyCreateResponse {
  dogApplyId: number;
  dogId: number;
  applicantId: number;
  status: ApplyStatus;
  createdAt: string;
  message: string;
}

// 2. 분양 신청 처리 요청/응답 타입
export interface DogApplyProcessRequest {
  status: 'APPROVED' | 'REJECTED';
}

export interface DogApplyProcessResponse {
  dogApplyId: number;
  dogId: number;
  applicantId: number;
  status: ApplyStatus;
  processedAt: string;
  message: string;
}

// 3. 분양 신청 삭제 응답 타입
export interface DogApplyDeleteResponse {
  dogApplyId: number;
  message: string;
}

// 4. 분양 신청 상세 조회 응답 타입
export interface DogApplyDetailResponse {
  dogApplyId: number;
  status: ApplyStatus;
  createdAt: string;
  processedAt: string | null;
  dog: {
    dogId: number;
    name: string;
    breedName: string;
    gender: 'MALE' | 'FEMALE';
    dogSize: string;
    imageUrl: string;
    adoptionStatus: string;
    ownerId: number;
    ownerNickname: string;
    shelterName: string;
    location: string;
  };
  applicant: {
    memberId: number;
    nickname: string;
    email: string;
  };
}

// 5. 내가 신청한 분양 신청 목록 응답 타입
export interface MyDogApplyResponse {
  dogApplyId: number;
  status: ApplyStatus;
  createdAt: string;
  processedAt: string | null;
  dogId: number;
  dogName: string;
  breedName: string;
  dogImageUrl: string;
  adoptionStatus: string;
  counterpartId: number;
  counterpartNickname: string;
  location: string;
}

// 6. 내 강아지에 대한 분양 신청 목록 응답 타입
export interface ReceivedDogApplyResponse {
  dogApplyId: number;
  status: ApplyStatus;
  createdAt: string;
  processedAt: string | null;
  dogId: number;
  dogName: string;
  breedName: string;
  dogImageUrl: string;
  adoptionStatus: string;
  counterpartId: number;
  counterpartNickname: string;
  location: string;
}

/**
 * 1. 분양 신청 생성
 */
export const createDogApply = async (dogApplyData: DogApplyCreateRequest): Promise<DogApplyCreateResponse> => {
  try {
    const response = await axios.post(DOG_APPLIES_BASE_URL, dogApplyData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`분양 신청 실패: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }
    throw error;
  }
};

/**
 * 2. 분양 신청 처리 (승인/거절)
 */
export const processDogApply = async (
  dogApplyId: number,
  processData: DogApplyProcessRequest
): Promise<DogApplyProcessResponse> => {
  try {
    const response = await axios.patch(`${DOG_APPLIES_BASE_URL}/${dogApplyId}/process`, processData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`분양 신청 처리 실패: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }
    throw error;
  }
};

/**
 * 3. 분양 신청 삭제 (대기 중인 신청만)
 */
export const deleteDogApply = async (dogApplyId: number): Promise<DogApplyDeleteResponse> => {
  try {
    const response = await axios.delete(`${DOG_APPLIES_BASE_URL}/${dogApplyId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`분양 신청 삭제 실패: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }
    throw error;
  }
};

/**
 * 4. 분양 신청 상세 조회
 */
export const getDogApplyDetail = async (dogApplyId: number): Promise<DogApplyDetailResponse> => {
  try {
    const response = await axios.get(`${DOG_APPLIES_BASE_URL}/${dogApplyId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`분양 신청 상세 조회 실패: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }
    throw error;
  }
};

/**
 * 5. 내가 신청한 분양 신청 목록 조회
 */
export const getMyDogApplies = async (
  page: number = 0,
  size: number = 10,
  status?: ApplyStatus
): Promise<MyDogApplyResponse[]> => {
  try {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    if (status) {
      params.status = status;
    }

    const response = await axios.get(`${DOG_APPLIES_BASE_URL}/my`, {
      params,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`내 분양 신청 목록 조회 실패: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }
    throw error;
  }
};

/**
 * 6. 내 강아지에 대한 분양 신청 목록 조회
 */
export const getReceivedDogApplies = async (
  page: number = 0,
  size: number = 10,
  status?: ApplyStatus
): Promise<ReceivedDogApplyResponse[]> => {
  try {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    if (status) {
      params.status = status;
    }

    const response = await axios.get(`${DOG_APPLIES_BASE_URL}/received`, {
      params,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`받은 분양 신청 목록 조회 실패: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }
    throw error;
  }
};