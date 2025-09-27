import axios from 'axios';

const DOGS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/dogs`;

export interface DogListResponseDto {
  dogId: number;
  name: string;
  breedName: string;
  gender: 'MALE' | 'FEMALE';
  dogSize: string;
  weight: number;
  adoptionStatus: string;
  imageUrl: string;
  memberNickname: string;
  shelterName: string;
  createdAt: string;
}

export interface DogCreateRequestDto {
  name: string;
  breedId: number;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  dogSize: string;
  weight: number;
  healthStatus: string;
  description: string;
  adoptionStatus: string;
  imageUrl: string;
  shelterId: number;
}

export interface DogCreateResponseDto {
  dogId: number;
  name: string;
  breed: {
    breedId: number;
    name: string;
  };
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  dogSize: string;
  weight: number;
  healthStatus: string;
  description: string;
  adoptionStatus: string;
  imageUrl: string;
  member: {
    memberId: number;
    nickname: string;
  };
  shelter: {
    shelterId: number;
    name: string;
    contact: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DogDetailResponseDto {
  dogId: number;
  name: string;
  breed: {
    breedId: number;
    name: string;
  };
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  dogSize: string;
  weight: number;
  healthStatus: string;
  description: string;
  adoptionStatus: string;
  imageUrl: string;
  member: {
    memberId: number;
    nickname: string;
  };
  shelter: {
    shelterId: number;
    name: string;
    contact: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DogUpdateRequestDto {
  name: string;
  breedId: number;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  dogSize: string;
  weight: number;
  healthStatus: string;
  description: string;
  adoptionStatus: string;
  imageUrl: string;
  shelterId: number;
}

export interface DogUpdateResponseDto {
  dogId: number;
  name: string;
  breed: {
    breedId: number;
    name: string;
  };
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  dogSize: string;
  weight: number;
  healthStatus: string;
  description: string;
  adoptionStatus: string;
  imageUrl: string;
  member: {
    memberId: number;
    nickname: string;
  };
  shelter: {
    shelterId: number;
    name: string;
    contact: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DogSearchRequestDto {
  q?: string;
  dogSize?: string;
  breedName?: string;
  gender?: 'MALE' | 'FEMALE';
  location?: string;
  adoptionStatus?: string;
  page?: number;
  size?: number;
}

export interface DogSearchResponseDto {
  id: string;
  dogId: number;
  name: string;
  breedName: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  dogSize: string;
  weight: number;
  healthStatus: string;
  description: string;
  adoptionStatus: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  memberId: number;
  shelterId: number;
  shelterName: string;
  location: string;
}

export interface DogDeleteResponseDto {
  dogId: number;
  memberId: number;
  message: string;
  success: boolean;
}

export const getDogs = async (page: number = 0, size: number = 10): Promise<DogListResponseDto[]> => {
  try {
    const response = await axios.get(`${DOGS_BASE_URL}?page=${page}&size=${size}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`유기견 목록 조회 실패: ${error.response?.status}`);
    }
    throw error;
  }
};

export const createDog = async (dogData: DogCreateRequestDto): Promise<DogCreateResponseDto> => {
  try {
    const response = await axios.post(DOGS_BASE_URL, dogData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    let errorMessage = `유기견 등록 실패`;
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

export const getDogById = async (dogId: number): Promise<DogDetailResponseDto> => {
  try {
    const response = await axios.get(`${DOGS_BASE_URL}/${dogId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`유기견 상세 조회 실패: ${error.response?.status}`);
    }
    throw error;
  }
};

export const searchDogs = async (searchParams: DogSearchRequestDto): Promise<DogSearchResponseDto[]> => {
  try {
    const response = await axios.get(`${DOGS_BASE_URL}/search`, {
      params: searchParams,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`유기견 검색 실패: ${error.response?.status}`);
    }
    throw error;
  }
};

export const updateDog = async (dogId: number, dogData: DogUpdateRequestDto): Promise<DogUpdateResponseDto> => {
  try {
    const response = await axios.patch(`${DOGS_BASE_URL}/${dogId}`, dogData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    let errorMessage = `유기견 수정 실패`;
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

export const deleteDog = async (dogId: number): Promise<DogDeleteResponseDto> => {
  try {
    const response = await axios.delete(`${DOGS_BASE_URL}/${dogId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    let errorMessage = `유기견 삭제 실패`;
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