const BREEDS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/breeds`;

export interface BreedSearchRequestDto {
  name: string;
}

export interface BreedSearchResponseDto {
  breedId: number;
  name: string;
}

export const searchBreedByName = async (name: string): Promise<BreedSearchResponseDto> => {
  const params = new URLSearchParams();
  params.append('name', name);

  const response = await fetch(`${BREEDS_BASE_URL}/search?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  if (!response.ok) {
    throw new Error(`견종 검색 실패: ${response.status}`);
  }

  return response.json();
};