import PetCard from "./PetCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Import pet images
import dog1 from "@/assets/dog-1.jpg";
import cat1 from "@/assets/cat-1.jpg";
import dog2 from "@/assets/dog-2.jpg";
import cat2 from "@/assets/cat-2.jpg";
import dog3 from "@/assets/dog-3.jpg";
import cat3 from "@/assets/cat-3.jpg";

const featuredPets = [
  {
    id: "1",
    name: "Buddy",
    breed: "Golden Retriever",
    age: "2 years",
    location: "Downtown Shelter",
    image: dog1,
    gender: "Male" as const,
    size: "Large" as const,
  },
  {
    id: "2", 
    name: "Whiskers",
    breed: "Tabby Cat",
    age: "3 years",
    location: "City Animal Center",
    image: cat1,
    gender: "Female" as const,
    size: "Medium" as const,
  },
  {
    id: "3",
    name: "Charlie",
    breed: "Beagle",
    age: "4 years",
    location: "Westside Rescue",
    image: dog2,
    gender: "Male" as const,
    size: "Medium" as const,
  },
  {
    id: "4",
    name: "Luna",
    breed: "Persian Cat",
    age: "1 year",
    location: "Happy Paws Shelter",
    image: cat2,
    gender: "Female" as const,
    size: "Small" as const,
  },
  {
    id: "5",
    name: "Max",
    breed: "Border Collie",
    age: "5 years",
    location: "Countryside Rescue",
    image: dog3,
    gender: "Male" as const,
    size: "Large" as const,
  },
  {
    id: "6",
    name: "Shadow",
    breed: "Domestic Shorthair",
    age: "2 years", 
    location: "Metro Animal Shelter",
    image: cat3,
    gender: "Male" as const,
    size: "Medium" as const,
  },
];

const FeaturedPets = () => {
  return (
    <section className="py-16 bg-gradient-soft">
      <div className="mx-auto px-2 sm:px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Meet Our
            <span className="text-primary font-handwritten"> Featured Friends</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These adorable pets are ready to find their forever homes. 
            Each one has a unique personality and so much love to give.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} {...pet} />
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm transition-smooth"
          >
            View All Available Pets
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPets;