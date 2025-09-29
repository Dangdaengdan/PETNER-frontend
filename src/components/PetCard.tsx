import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PetCardProps {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  location: string;
  image: string;
  gender: string;
  size: string;
}

const PetCard = ({ id, name, breed, birthDate, location, image, gender, size }: PetCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const calculateAge = (birthDate: string) => {
    if (!birthDate || birthDate.length < 6) {
      return "나이 정보 없음";
    }

    try {
      const year = parseInt(birthDate.slice(0, 4));
      const month = parseInt(birthDate.slice(4, 6)) - 1; // JS Date는 0-based month
      const birth = new Date(year, month);
      const now = new Date();

      let ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());

      // 음수 나이인 경우 (미래 날짜) 처리
      if (ageInMonths < 0) {
        return "나이 정보 없음";
      }

      if (ageInMonths < 12) {
        return ageInMonths === 0 ? "1개월 미만" : `${ageInMonths}개월`;
      } else {
        const ageInYears = Math.floor(ageInMonths / 12);
        return `${ageInYears}살`;
      }
    } catch (error) {
      return "나이 정보 없음";
    }
  };

  const displayAge = calculateAge(birthDate);

  return (
    <Card className="group overflow-hidden bg-card border-border rounded-3xl shadow-petcard w-full transition-transform duration-300 hover:-translate-y-2 p-8">
      <div className="relative overflow-hidden rounded-2xl">
        <AspectRatio ratio={16 / 9}>
          <img
            src={image}
            alt={`${name} - ${breed}`}
            className="w-full h-full object-cover object-center"
          />
        </AspectRatio>
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 p-3 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorited 
                ? "text-accent fill-current" 
                : "text-muted-foreground"
            }`}
          />
        </button>
        
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {gender}
          </Badge>
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {size}
          </Badge>
        </div>
      </div>

      <CardContent className="p-0 pt-8">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {name}
            </h3>
            <p className="text-muted-foreground">{breed}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{displayAge}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              asChild
              className="flex-1 bg-brown-400 hover:bg-brown-600 text-white rounded-full transition-colors"
            >
              <Link to={`/pet/${id}`}>
                Meet {name}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCard;