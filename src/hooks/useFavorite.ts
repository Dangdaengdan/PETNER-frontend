import { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '@/api/favorite';

export const useFavorite = (dogId: number, initialIsFavorite?: boolean) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorite ?? false);
  const [isLoading, setIsLoading] = useState(false);

  // initialIsFavorite가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (initialIsFavorite !== undefined) {
      setIsFavorited(initialIsFavorite);
    }
  }, [initialIsFavorite]);

  // 초기값이 제공되지 않은 경우에만 API 호출로 상태 확인
  useEffect(() => {
    if (initialIsFavorite !== undefined) {
      return; // 초기값이 있으면 API 호출하지 않음
    }

    const checkFavoriteStatus = async () => {
      try {
        const favoriteStatus = await isFavorite(dogId);
        setIsFavorited(favoriteStatus);
      } catch (error) {
        console.error('관심 목록 상태 확인 실패:', error);
      }
    };

    if (dogId && dogId > 0) {
      checkFavoriteStatus();
    }
  }, [dogId, initialIsFavorite]);

  // 관심 목록 토글 함수
  const toggleFavorite = async () => {
    if (isLoading || !dogId || dogId <= 0) return;

    setIsLoading(true);
    try {
      if (isFavorited) {
        // 관심 목록에서 제거
        await removeFavorite(dogId);
        setIsFavorited(false);
        alert('관심 목록에서 제거되었습니다.');
      } else {
        // 관심 목록에 추가
        await addFavorite(dogId);
        setIsFavorited(true);
        alert('관심 목록에 추가되었습니다.');
      }
    } catch (error) {
      console.error('관심 목록 변경 실패:', error);
      alert('관심 목록 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFavorited,
    isLoading,
    toggleFavorite,
  };
};