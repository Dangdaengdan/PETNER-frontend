import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar } from "lucide-react";
import { useState } from "react";

interface PetCardProps {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  gender: "Male" | "Female";
  size: "Small" | "Medium" | "Large";
}

const PetCard = ({ name, breed, age, location, image, gender, size }: PetCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className="group overflow-hidden transition-smooth hover:shadow-warm hover:-translate-y-1 bg-card border-border">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={`${name} - ${breed}`}
          className="w-full h-64 object-cover transition-smooth group-hover:scale-105"
        />
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-smooth hover:bg-background"
        >
          <Heart
            className={`h-4 w-4 transition-smooth ${
              isFavorited 
                ? "text-accent fill-current" 
                : "text-muted-foreground hover:text-accent"
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

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-smooth">
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
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
            >
              Meet {name}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCard;