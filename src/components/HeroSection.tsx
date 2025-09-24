import heroImage from "@/assets/hero-pets.jpg";
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
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>

        {/* Content inside container (has horizontal padding) */}
        <div className="relative z-10 py-24 container">
          <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-bold text-center mb-8 leading-tight">
            PET:NER
            <span className="text-5xl sm:text-6xl lg:text-7xl text-primary font-handwritten block mt-8">
              Find Your Forever Friend
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-center mb-8 leading-relaxed">
            유기견들은 따뜻한 집이 필요하고, 우리는 함께할 친구가 필요합니다. <br/>입양을 통해 서로의 빈자리를 채워보세요.
          </p>

          {/* Search UI moved below to FeaturedPets section */}


          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto place-items-center text-center">
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
    </section>
  );
};

export default HeroSection;