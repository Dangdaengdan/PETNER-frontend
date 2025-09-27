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

export const searchDogs = async (searchParams: DogSearchRequestDto): Promise<DogSearchResponseDto[]> => {
  const params = new URLSearchParams();

  if (searchParams.q) params.append('q', searchParams.q);
  if (searchParams.dogSize) params.append('dogSize', searchParams.dogSize);
  if (searchParams.breedName) params.append('breedName', searchParams.breedName);
  if (searchParams.gender) params.append('gender', searchParams.gender);
  if (searchParams.location) params.append('location', searchParams.location);
  if (searchParams.adoptionStatus) params.append('adoptionStatus', searchParams.adoptionStatus);
  if (searchParams.page !== undefined) params.append('page', searchParams.page.toString());
  if (searchParams.size !== undefined) params.append('size', searchParams.size.toString());

  const response = await fetch(`${DOGS_BASE_URL}/search?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  if (!response.ok) {
    throw new Error(`유기견 검색 실패: ${response.status}`);
  }

  return response.json();
};

export const updateDog = async (dogId: number, dogData: DogUpdateRequestDto): Promise<DogUpdateResponseDto> => {
  const response = await fetch(`${DOGS_BASE_URL}/${dogId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(dogData),
  });

  if (!response.ok) {
    let errorMessage = `유기견 수정 실패: ${response.status}`;
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

export const deleteDog = async (dogId: number): Promise<DogDeleteResponseDto> => {
  const response = await fetch(`${DOGS_BASE_URL}/${dogId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  if (!response.ok) {
    let errorMessage = `유기견 삭제 실패: ${response.status}`;
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