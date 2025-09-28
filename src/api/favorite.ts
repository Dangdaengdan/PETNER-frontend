import axios from "axios";

const FAVORITES_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/favorites`;

// 관심 반려동물 응답
export interface FavoriteResponse {
  favoriteId: number;
  createdAt: string;
  dogInfo: {
    dogId: number;
    dogName: string;
    dogImageUrl?: string;
    breedName: string;
    dogSize: string;
    age: number;
    gender: string;
    adoptionStatus: string;
    shelterName: string;
    locationName: string;
  };
}

// 관심 반려동물 페이징 응답
export interface FavoritesPageResponse {
  content: FavoriteResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 관심 반려동물 추가 요청
export interface FavoriteCreateRequest {
  dogId: number;
}

// 관심 반려동물 페이징 응답
export interface FavoritesPageResponse {
  content: FavoriteResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 관심 반려동물 추가/제거 응답
export interface FavoriteActionResponse {
  message: string;
  success: boolean;
}

// 관심 반려동물 목록 조회 (페이징)
export const getMyFavorites = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc'
): Promise<FavoritesPageResponse> => {
  try {
    const response = await axios.get(`${FAVORITES_BASE_URL}/my`, {
      params: {
        page: page.toString(),
        size: size.toString(),
        sort: sort,
      },
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `관심 반려동물 목록 조회 실패`;
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

// 관심 반려동물 전체 목록 조회 (페이징 없음)
export const getAllMyFavorites = async (): Promise<FavoriteResponse[]> => {
  try {
    const response = await axios.get(`${FAVORITES_BASE_URL}/my/all`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `관심 반려동물 전체 목록 조회 실패`;
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

// 관심 반려동물 추가
export const addFavorite = async (dogId: number): Promise<FavoriteActionResponse> => {
  try {
    const response = await axios.post(FAVORITES_BASE_URL, { dogId }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `관심 반려동물 추가 실패`;
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

// 관심 반려동물 제거
export const removeFavorite = async (dogId: number): Promise<FavoriteActionResponse> => {
  try {
    const response = await axios.delete(`${FAVORITES_BASE_URL}/${dogId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `관심 반려동물 제거 실패`;
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

// 특정 유기견이 관심 목록에 있는지 확인
export const isFavorite = async (dogId: number): Promise<boolean> => {
  try {
    const response = await axios.get(`${FAVORITES_BASE_URL}/check/${dogId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.favorite;
  } catch (error) {
    let errorMessage = `관심 반려동물 확인 실패`;
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