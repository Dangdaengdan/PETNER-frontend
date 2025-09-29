import { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '@/api/favorite';
import { useToast } from '@/hooks/use-toast';
import { getCurrentMember } from '@/api/auth';

export const useFavorite = (dogId: number, initialIsFavorite?: boolean, onLoginRequired?: () => void) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorite ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

    // 로그인 상태 확인
    try {
      await getCurrentMember();
    } catch (error) {
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        toast({
          title: "로그인이 필요합니다",
          description: "찜목록 기능을 사용하려면 로그인해주세요.",
        });
      }
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        // 관심 목록에서 제거
        await removeFavorite(dogId);
        setIsFavorited(false);
        toast({
          title: "관심 목록에서 제거되었습니다",
          description: "찜목록에서 성공적으로 제거되었습니다.",
        });
      } else {
        // 관심 목록에 추가
        await addFavorite(dogId);
        setIsFavorited(true);
        toast({
          title: "관심 목록에 추가되었습니다",
          description: "찜목록에 성공적으로 추가되었습니다.",
        });
      }
    } catch (error) {
      console.error('관심 목록 변경 실패:', error);
      toast({
        title: "변경 실패",
        description: "관심 목록 변경에 실패했습니다. 다시 시도해주세요.",
      });
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