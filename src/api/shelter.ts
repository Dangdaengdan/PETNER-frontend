const SHELTERS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/shelters`;

export interface ShelterSearchRequestDto {
  name: string;
}

export interface ShelterSearchResponseDto {
  shelterId: number;
  name: string;
}

export const searchShelterByName = async (name: string): Promise<ShelterSearchResponseDto> => {
  const params = new URLSearchParams();
  params.append('name', name);

  const response = await fetch(`${SHELTERS_BASE_URL}/search?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  if (!response.ok) {
    throw new Error(`보호소 검색 실패: ${response.status}`);
  }

  return response.json();
};