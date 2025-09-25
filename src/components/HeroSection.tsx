import heroImage from "@/assets/hero.png";
import { } from "react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[720px] lg:min-h-[880px] flex items-center overflow-hidden">
      {/* Background spans full width (no gutters) */}
      <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Happy pets waiting for adoption"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content inside container (has horizontal padding) */}
        <div className="relative z-10 py-24 container">
          <div className="max-w-2xl">
          <h1 className="text-9xl sm:text-10xl lg:text-11xl font-bold text-left mb-4">
            PET:NER
            <span className="text-3xl sm:text-4xl lg:text-5xl text-primary block mt-2">
            Find Your Forever Friend
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-foreground mb-8 leading-relaxed">
          유기견들은 따뜻한 집이 필요하고, 우리는 함께할 친구가 필요합니다. <br/>pet:ner와 함께 서로의 빈자리를 채워보세요.
          </p>

          {/* Search UI moved below to FeaturedPets section */}


          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto place-items-left text-foreground">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">입양된 반려동물</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">함께하는 보호소</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">후원자 수</div>
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