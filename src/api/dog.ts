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

export const getDogs = async (page: number = 0, size: number = 10): Promise<DogListResponseDto[]> => {
  const response = await fetch(`${DOGS_BASE_URL}?page=${page}&size=${size}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  if (!response.ok) {
    throw new Error(`유기견 목록 조회 실패: ${response.status}`);
  }

  return response.json();
};

export const createDog = async (dogData: DogCreateRequestDto): Promise<DogCreateResponseDto> => {
  const response = await fetch(DOGS_BASE_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(dogData),
  });

  if (!response.ok) {
    let errorMessage = `유기견 등록 실패: ${response.status}`;
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

export const getDogById = async (dogId: number): Promise<DogDetailResponseDto> => {
  const response = await fetch(`${DOGS_BASE_URL}/${dogId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  if (!response.ok) {
    throw new Error(`유기견 상세 조회 실패: ${response.status}`);
  }

  return response.json();
};