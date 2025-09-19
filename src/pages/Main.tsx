import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedPets from "@/components/FeaturedPets";
import AdoptionProcess from "@/components/AdoptionProcess";
import Footer from "@/components/Footer";

const Main = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedPets />
      <AdoptionProcess />
      <Footer />
    </div>
  );
};

export default Main;