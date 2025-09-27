import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UPLOAD_URL = `${API_BASE_URL}/api/v1/upload`;

// Presigned URL 요청 및 파일 업로드 함수
export const uploadImageToGCP = async (file: File): Promise<string> => {
    try {
        // 1. presigned URL 요청
        const presignedRes = await axios.get(`${UPLOAD_URL}/presigned-url`, {
            params: { fileName: file.name, fileType: file.type },
            withCredentials: true
        });
        const { url, objectName } = presignedRes.data;

        // 2. presigned URL로 PUT 요청하여 파일 업로드
        await axios.put(url, file, {
            headers: {
                "Content-Type": file.type
            }
        });

        // 3. 업로드 후 저장된 파일의 URL은 presigned URL을 통해 가져와야 하므로 객체명을 반환
        return objectName;
    } catch (error) {
        console.error("파일 업로드 실패:", error);
        throw error;
    }
};

// Presigned GET URL을 통해 보호된 이미지 URL 가져오기
export const getProtectedImageUrl = async (objectName: string): Promise<string> => {
    try {
        const res = await axios.get(`${UPLOAD_URL}/presigned-url/download`, {
            params: { objectName },
            withCredentials: true
        });
        return res.data.imageUrl || res.data.thumbImageUrl;
    } catch (error) {
        console.error("❌ 이미지 URL 가져오기 실패:", error);
        throw error;
    }
};