import React, { useState, useEffect } from "react";
import { getProtectedImageUrl } from "../api/upload";

interface ProtectedImageProps {
    objectName: string;
    alt?: string;
    className?: string;
}

export const ProtectedImage: React.FC<ProtectedImageProps> = ({
    objectName,
    alt = "Image",
    className = "w-32 h-32 object-cover rounded-lg"
}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!objectName) return;

        const fetchImageUrl = async () => {
            try {
                const url = await getProtectedImageUrl(objectName);
                setImageUrl(url);
            } catch (error) {
                console.error("❌ 이미지 URL 가져오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImageUrl();
        const interval = setInterval(fetchImageUrl, 4 * 60 * 1000 + 20 * 1000); // 4분 30초마다 새 Presigned URL 요청

        return () => clearInterval(interval);
    }, [objectName]);

    if (loading) {
        return (
            <div className="animate-pulse bg-gray-200 rounded w-full h-48 flex items-center justify-center">
                로딩 중...
            </div>
        );
    }

    return imageUrl ? (
        <img src={imageUrl} alt={alt} className={className} />
    ) : (
        <div>❌ 이미지 로드 실패</div>
    );
};