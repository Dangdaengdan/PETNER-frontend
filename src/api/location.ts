const LOCATION_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/locations`;

export interface LocationSearchResponse {
  locationId: number;
  name: string;
}

export const searchLocationByName = async (name: string): Promise<LocationSearchResponse> => {
  try {
    const encodedName = encodeURIComponent(name);
    const response = await fetch(`${LOCATION_BASE_URL}/search?name=${encodedName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to search location: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
};