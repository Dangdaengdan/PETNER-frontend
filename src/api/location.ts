import axios from 'axios';

const LOCATION_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/locations`;

export interface LocationSearchResponse {
  locationId: number;
  name: string;
}

export const searchLocationByName = async (name: string): Promise<LocationSearchResponse> => {
  try {
    const response = await axios.get(`${LOCATION_BASE_URL}/search`, {
      params: { name },
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error searching location:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to search location: ${error.response?.status}`);
    }
    throw error;
  }
};