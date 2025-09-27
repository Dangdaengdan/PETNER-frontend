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