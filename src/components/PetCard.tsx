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
  age: string;
  location: string;
  image: string;
  gender: string;
  size: string;
}

const PetCard = ({ id, name, breed, age, location, image, gender, size }: PetCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

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
              <span>{age}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              asChild
              className="flex-1 bg-[#A3966A] hover:bg-[#895D2B] text-white rounded-full transition-colors"
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