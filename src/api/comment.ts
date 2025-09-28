import axios from "axios";

const COMMENTS_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/posts`;

// 댓글 생성 요청
export interface CommentCreateRequest {
  content: string;
  parentCommentId?: number;
}

// 댓글 수정 요청
export interface CommentUpdateRequest {
  content: string;
}

// 댓글 응답
export interface CommentResponse {
  commentId: number;
  content: string;
  authorNickname: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  parentCommentId?: number;
  isReply: boolean;
  replies: CommentResponse[];
}

// 댓글 페이징 응답
export interface CommentsPageResponse {
  content: CommentResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 댓글 삭제 응답
export interface CommentDeleteResponse {
  commentId: number;
  memberId: number;
  message: string;
  success: boolean;
}

// 댓글 생성
export const createComment = async (
  postId: number,
  commentData: CommentCreateRequest
): Promise<CommentResponse> => {
  try {
    const response = await axios.post(`${COMMENTS_BASE_URL}/${postId}/comments`, commentData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `댓글 생성 실패`;
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

// 댓글 조회 (페이징)
export const getComments = async (
  postId: number,
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,asc'
): Promise<CommentsPageResponse> => {
  try {
    const response = await axios.get(`${COMMENTS_BASE_URL}/${postId}/comments`, {
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
    let errorMessage = `댓글 조회 실패`;
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

// 댓글 수정
export const updateComment = async (
  postId: number,
  commentId: number,
  commentData: CommentUpdateRequest
): Promise<CommentResponse> => {
  try {
    const response = await axios.patch(`${COMMENTS_BASE_URL}/${postId}/comments/${commentId}`, commentData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `댓글 수정 실패`;
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

// 댓글 삭제
export const deleteComment = async (
  postId: number,
  commentId: number
): Promise<CommentDeleteResponse> => {
  try {
    const response = await axios.delete(`${COMMENTS_BASE_URL}/${postId}/comments/${commentId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `댓글 삭제 실패`;
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