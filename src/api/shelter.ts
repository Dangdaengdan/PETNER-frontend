import axios from 'axios';

const SHELTERS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/shelters`;

export interface ShelterSearchRequestDto {
  name: string;
}

export interface ShelterSearchResponseDto {
  shelterId: number;
  name: string;
}

export const searchShelterByName = async (name: string): Promise<ShelterSearchResponseDto> => {
  try {
    const response = await axios.get(`${SHELTERS_BASE_URL}/search`, {
      params: { name },
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`보호소 검색 실패: ${error.response?.status}`);
    }
    throw error;
  }
};