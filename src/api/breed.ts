import axios from 'axios';

const BREEDS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/breeds`;

export interface BreedSearchRequestDto {
  name: string;
}

export interface BreedSearchResponseDto {
  breedId: number;
  name: string;
}

export const searchBreedByName = async (name: string): Promise<BreedSearchResponseDto> => {
  try {
    const response = await axios.get(`${BREEDS_BASE_URL}/search`, {
      params: { name },
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`견종 검색 실패: ${error.response?.status}`);
    }
    throw error;
  }
};