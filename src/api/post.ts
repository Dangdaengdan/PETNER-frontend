import axios from "axios";

const POSTS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/posts`;

export interface PostCreateRequest {
  title: string;
  content: string;
  thumbImageUrl?: string;
}

export interface PostUpdateRequest {
  title: string;
  content: string;
  thumbImageUrl?: string;
}

export interface PostResponse {
  postId: number;
  title: string;
  content: string;
  thumbImageUrl?: string;
  authorNickname: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostSummaryResponse {
  postId: number;
  title: string;
  thumbImageUrl?: string;
  authorNickname: string;
  viewCount: number;
  createdAt: string;
}

export interface PostDeleteResponse {
  message: string;
}

export interface PostDocument {
  postId: number;
  title: string;
  content: string;
  thumbImageUrl?: string;
  authorNickname: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostsPageResponse {
  content: PostSummaryResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 게시물 생성
export const createPost = async (postData: PostCreateRequest): Promise<PostResponse> => {
  try {
    const response = await axios.post(POSTS_BASE_URL, postData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `게시물 생성 실패`;
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

// 게시물 상세 조회
export const getPost = async (postId: number): Promise<PostResponse> => {
  try {
    const response = await axios.get(`${POSTS_BASE_URL}/${postId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `게시물 조회 실패`;
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

// 게시물 목록 조회
export const getPosts = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc'
): Promise<PostsPageResponse> => {
  try {
    const response = await axios.get(POSTS_BASE_URL, {
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
    let errorMessage = `게시물 목록 조회 실패`;
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

// 게시물 수정
export const updatePost = async (
  postId: number,
  postData: PostUpdateRequest
): Promise<PostResponse> => {
  try {
    const response = await axios.patch(`${POSTS_BASE_URL}/${postId}`, postData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `게시물 수정 실패`;
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

// 게시물 삭제
export const deletePost = async (postId: number): Promise<PostDeleteResponse> => {
  try {
    const response = await axios.delete(`${POSTS_BASE_URL}/${postId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `게시물 삭제 실패`;
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

// 게시물 검색
export const searchPosts = async (
  query?: string,
  sort: string = 'latest',
  page: number = 0,
  size: number = 10
): Promise<PostDocument[]> => {
  try {
    const params: Record<string, string> = {
      sort: sort,
      page: page.toString(),
      size: size.toString(),
    };

    if (query) {
      params.q = query;
    }

    const response = await axios.get(`${POSTS_BASE_URL}/search`, {
      params,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `게시물 검색 실패`;
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

// 내 게시물 조회
export const getMyPosts = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc'
): Promise<PostsPageResponse> => {
  try {
    const response = await axios.get(`${POSTS_BASE_URL}/my`, {
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
    let errorMessage = `내 게시물 조회 실패`;
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