import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-pets.jpg";
import SearchFilters from "./SearchFilters";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Happy pets waiting for adoption"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto px-2 sm:px-4 lg:px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold text-center mb-6 leading-tight">
            PET:NER
            <span className="text-4xl sm:text-5xl lg:text-6xl text-primary font-handwritten block mt-4">
              Find Your Forever Friend
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-center mb-8 leading-relaxed">
            유기견들은 따뜻한 집이 필요하고, 우리는 함께할 친구가 필요합니다. <br/>입양을 통해 서로의 빈자리를 채워보세요.
          </p>

          {/* Search Bar */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="품종, 나이, 지역으로 검색하세요..."
                  className="pl-12 h-14 text-lg bg-background/95 border-border shadow-warm"
                />
              </div>
              <Button 
                size="lg" 
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm transition-smooth"
              >
                <Search className="mr-2 h-5 w-5" />
                검색
              </Button>
            </div>
            
            {/* Search Filters */}
            <SearchFilters onFilterChange={(filters) => console.log("Filters changed:", filters)} />
          </div>


          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
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