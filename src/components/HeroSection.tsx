import heroImage from "@/assets/hero.jpeg";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 스크롤에 따라 블러 효과 계산 (0에서 8px까지)
  const blurAmount = Math.min(8, scrollY * 0.02);

  return (
    <section className="relative min-h-[780px] lg:min-h-[1000px] flex items-center overflow-hidden mb-16 lg:mb-24">
      {/* Background spans full width (no gutters) */}
      <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Happy pets waiting for adoption"
            className="w-full h-full object-cover transition-all duration-300"
            style={{
              filter: `blur(${blurAmount}px)`,
            }}
          />
          {/* 밝은 오버레이로 이미지를 연하게 만들어 텍스트 가독성 향상 */}
          <div className="absolute inset-0 bg-white/20" />
        </div>

        {/* Content inside container (has horizontal padding) */}
        <div className="relative z-10 pt-12 pb-24 mx-auto px-8 sm:px-16 md:px-24 lg:px-8">
          <div className="max-w-2xl">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-left mb-4">
            PET:NER
            <span className="text-3xl sm:text-4xl lg:text-5xl text-orange-700 block mt-2">
            Find Your Forever Friend!
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground mb-8 leading-relaxed text-left">
          유기견들은 따뜻한 집이 필요하고, 우리는 함께할 친구가 필요합니다. <br/>pet:ner와 함께 서로의 빈자리를 채워보세요.
          </p>

          {/* Key value props */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
            <div className="flex items-center justify-center gap-2 rounded-full bg-background/70 backdrop-blur-sm px-4 py-2 shadow-warm">
              <span className="text-xl">🐾</span>
              <span className="text-sm sm:text-base md:text-lg font-medium text-foreground">맞춤 매칭</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full bg-background/70 backdrop-blur-sm px-4 py-2 shadow-warm">
              <span className="text-xl">🏡</span>
              <span className="text-sm sm:text-base md:text-lg font-medium text-foreground">안전한 입양</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full bg-background/70 backdrop-blur-sm px-4 py-2 shadow-warm">
              <span className="text-xl">💌</span>
              <span className="text-sm sm:text-base md:text-lg font-medium text-foreground">사후 케어</span>
            </div>
          </div>

          {/* Search UI moved below to FeaturedPets section */}


          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl text-foreground">
            <div className="text-left">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-700">500+</div>
              <div className="text-xs sm:text-sm md:text-base text-muted-foreground text-orange-700">입양된 반려동물</div>
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-700">50+</div>
              <div className="text-xs sm:text-sm md:text-base text-muted-foreground text-orange-700">함께하는 보호소</div>
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-700">100+</div>
              <div className="text-xs sm:text-sm md:text-base text-muted-foreground text-orange-700">후원자 수</div>
            </div>
          </div>
          </div>
        </div>
        {/* Soft fade at the bottom to blend with page background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 fade-to-background pointer-events-none" />
    </section>
  );
};

export default HeroSection;
